# coding=UTF-8
from urllib import request,error
import re
import time
import schedule
from bs4 import BeautifulSoup
from pymongo import MongoClient
from selenium import webdriver

client = MongoClient('mongodb://127.0.0.1:27017/') # 本地
# client = MongoClient('mongodb://xxxx:27017/') # 阿里云
db = client['match']
collection1 = db['matchlist']
collection2 = db['basicmatchdetail']
collection3 = db['matchplaybyplaycn']
collection4 = db['playeraveragedata']

chrome_options = webdriver.ChromeOptions()
chrome_options.add_argument('--headless')
browser = webdriver.Chrome(options=chrome_options)

'''
date:2019/5/15

1：爬取18-19赛季的NBA比赛列表写进collection1
2：爬取18-19赛季的NBA比赛基础统计数据写进collection2
3：爬取18-19赛季的NBA比赛时序事件数据写进collection3
4：爬取球员的生涯场均表现数据写进collection4
5：数据格式如下：
比赛列表
db：match
collection：matchlist
json = {'date':'2019-03-01',
        'content':['公牛vs老鹰','黄蜂vs篮网'...],
        'url':[url1,url2,...]}
        
基础统计数据
db：match
collection：basicmatchdetail
json = {
    'date':'xxxx-xx-xx',
    'url':'xxxx.html',
    'team1Info':['name','img','赛前战绩(xx-xx)'],
    'team1Home':['主客队'],
    'team1Score':['第一节得分','第二节得分','第三节得分','第四节得分'],
    'team2Info':['name','img','赛前战绩(xx-xx)'],
    'team1Home':['主客队'],
    'team2Score':['第一节得分','第二节得分','第三节得分','第四节得分'],
    'team1Detail':[[xx1Detail],[xx2Detail]...] ,
    'team1Summary':[[team1Summary]],
    'team2Detail':[[xx1Detail],[xx2Detail]...],
    'team1Summary':[team1Summary]
}

时序事件数据
db: match
collection: matchplaybyplaycn
json = {
    'url': 'xxxx.html',
    'quarter1': [['时间','team1事件详情','team1事件总结','当前比分','team2事件总结','team2事件详情'],...],
    'quarter2': [['时间','team1事件详情','team1事件总结','当前比分','team2事件总结','team2事件详情'],...],
    'quarter3': [['时间','team1事件详情','team1事件总结','当前比分','team2事件总结','team2事件详情'],...],
    'quarter4': [['时间','team1事件详情','team1事件总结','当前比分','team2事件总结','team2事件详情'],...]
}

球员生涯场均表现数据（以勒布朗-詹姆斯为例）
url: http://www.stat-nba.com/player/1862.html
db: matchlist
collection: matchplayer
json = {
    'url': 'http://www.stat-nba.com/player/1862.html',
    'cnName': '勒布朗-詹姆斯',
    'engName': 'LeBron James',
    'img': 'http://www.stat-nba.com/image/playerImage/1862.jpg',
    'baidu': 'http://baike.baidu.com/view/110186.htm',
    'wiki': 'http://en.wikipedia.org/wiki/LeBron_James'
    'seasonAvg': ["16年",  NBA生涯
        "3支",  效力球队
        "1177", 出场
        "1176", 首发
        "38.6", 时间
        "50.4%", 投篮命中率
        "9.9", 命中数
        "19.6", 出手数
        "34.4%", 三分命中率
        "1.4", 三分命中数
        "4.2", 三分出手数
        "73.8%", 罚球命中率
        "6.0", 罚球命中数
        "8.1", 罚球出手数
        "7.4", 篮板
        "1.2", 前场篮板
        "6.2", 后场篮板
        "7.2", 助攻
        "1.6", 抢断
        "0.8", 盖帽
        "3.5", 失误
        "1.8", 犯规
        "27.2", 得分
        "781", 胜场
        "396"], 负场 
}
'''

'''
爬取页面
'''
def get_one_page(url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36'
    }
    try:
        req = request.Request(url=url,headers=headers)
        global MAX_NUM
        MAX_NUM = 6
        for i in range(MAX_NUM):
            try:
                response = request.urlopen(req,timeout=5).read().decode('utf-8')
                return response
            except:
                if i < MAX_NUM-1:
                    print(i)
                    continue
                else:
                    pass
    except error.HTTPError as e:
        pass

def get_one_page_selenium(url):
    try:
        browser.get(url)
        for m in range(MAX_NUM):
            try:
                soup = BeautifulSoup(browser.page_source, 'lxml')
                tbody = soup.find('tbody', id='detail_q')
                if tbody:
                    target = {}
                    target[u'url'] = url
                    j = 0
                    for i in ['.pbp_1q.pbp_chooser','.pbp_2q.pbp_chooser','.pbp_3q.pbp_chooser','.pbp_4q.pbp_chooser']:
                        j += 1
                        res = browser.find_element_by_css_selector(i)
                        res.click()
                        play = parse_playbyplay(browser.page_source)
                        target[u'quarter'+str(j)] = play
                    # mongodb中不存在插入,这里不需更新
                    if collection3.find({'url': str(target['url'])}).count() == 0:
                        save_playbyplay(target)
                        print('比赛%s时序数据爬取完成' % (str(url)))
                    else:
                        pass
                else:
                    pass
            except:
                if m < MAX_NUM - 1:
                    print(m)
                    continue
                else:
                    pass
    finally:
        pass

'''
解析比赛详情页
'''
global all
all = []

## 比赛列表
def parse_matchlist(html):
    soup = BeautifulSoup(html,'lxml')
    cheight = soup.find_all('div','cheight')
    base_url='http://stat-nba.com/'
    for div in cheight:
        if div.text.strip()!='':
            d={}
            date=div.find('font','cheightdate')
            d[u'date']=str(date.text)
            matchs = []
            urls = []
            for match in div.find_all('a',href=re.compile('game/.*?html',re.S)):
                matchs.append(str(match.text))
                urls.append(base_url+str(match['href']))
            d[u'content']=matchs
            d[u'url']=urls
            all.append(d)
            # mongodb中不存在插入
            if collection1.find({'date': str(date.text)}).count() == 0 :
                save_matchlist(d)
            else:
                # mongodb中存在判断是否更新
                for i in collection1.find({'date': str(date.text)}):
                    if i['content'] == d['content']:
                        pass # 内容不变化不更新
                    else:
                        collection1.update({'date': str(date.text)},{'$set':{'content':d['content']}}) # 内容变化更新
                        collection1.update({'date': str(date.text)},{'$set':{'url':d['url']}}) # 内容变化更新
                        print('列表内容更新')
        else:
            continue

## 时序事件中文
def parse_playbyplay(html):
    soup = BeautifulSoup(html,'lxml')
    tbody = soup.find('tbody',id='detail_q')
    play = []
    for tr in tbody.find_all('tr'):
        d = []
        for td in tr.find_all('td'):
            d.append(td.text)
        play.append(d)
    return play

## 基础统计数据
def parse_basicmatchdetai(html,url):
    soup = BeautifulSoup(html,'lxml')
    basic = soup.find('div','basic')
    Statbox = soup.find_all('div','stat_box')
    if Statbox:
        i=0
        target={}
        target[u'url'] = str(url)
        for team in basic.find_all('div','team'):
            i+=1
            dataInfo=[]
            for a in team.find_all('a',href=re.compile('/team.*?.html')):
                if(a.text.strip() == ''):
                    dataInfo.append('http://stat-nba.com/' + a.find('img')['src'])
                else:
                    dataInfo.append(a.text)
            dataInfo.append(team.find('a',href=re.compile('/query.*')).text)
            target[u'team'+str(i)+'Info'] = dataInfo
        i=0
        Score = basic.find('div','scorebox')
        for text in Score.find_all('div','text'):
            i+=1
            dataHome=[]
            for div in text.find_all('div'):
                dataHome.append(div.text)
            target[u'team'+str(i)+'Home']=dataHome
        i=0
        for table in Score.find_all('div','table'):
            i+=1
            dataScore=[]
            for td in table.find_all('td','number'):
                dataScore.append(td.text)
            target[u'team'+str(i)+'Score'] = dataScore
        i=0
        for statbox in Statbox:
            DataDetail=[]
            DataSummary=[]
            i+=1
            for tr in statbox.find_all('tr','sort'):
                d=[]
                for td in tr.find_all('td'):
                    if td.text.strip() != '':
                        d.append(str(td.text))
                    else:
                        continue
                DataDetail.append(d)
            if(DataDetail != []):
                target[u'team'+str(i)+'Detail'] = DataDetail
            for tr in statbox.find_all('tr','team_all_content'):
                d=[]
                for td in tr.find_all('td'):
                    if(td.text != '-'):
                        d.append(str(td.text))
                    else:
                        continue
                DataSummary.append(d)
            if(DataSummary != []):
                target[u'team'+str(i)+'Summary'] = DataSummary
        # mongodb中不存在插入,这里不需更新
        if collection2.find({'url': str(target['url'])}).count() == 0:
            save_basicmatchdetail(target)
            print('比赛%s基础统计数据爬取完成' % (str(url)))
        else:
            print('比赛%s基础统计数据重复入库' % (str(url)))
            pass
    else:
        pass

## 生涯场均数据
def parse_averagedata(html,url):
    # (考虑情况作过滤)
    soup = BeautifulSoup(html,'lxml')
    info = soup.find('div',class_='playerinfo')
    target = {}
    target[u'url'] = url
    # name过滤
    name = info.find('div',class_='name').text.split('\n')[0].split('/')
    if name:
        if len(name) == 1:
            target[u'engName'] = name[0]
        if len(name) == 2:
            target[u'cnName'] = name[0]
            target[u'engName'] = name[1]
    target[u'img'] = 'http://www.stat-nba.com'+str(info.find('img')['src'])
    # baidu和wiki百科过滤
    baike = info.find('div',class_='name').find_all('a')
    if baike:
        if len(baike) == 1:
            target[u'wiki'] = baike[0]['href']
        if len(baike) == 2:
            target[u'baidu'] = baike[0]['href']
            target[u'wiki'] = baike[1]['href']
    stat = soup.find('div',id='stat_box')
    if stat:
        for d in stat.find_all('div'):
            if d.text.strip() != '':
                table = d.find('table',id='stat_box_avg')
                if table:
                    content = table.find('tbody').find_all('tr')[-1].text.split('\n')
                    while '' in content:
                        content.remove('')
                    target[u'seasonAvg'] = content
                else:
                    continue
            else:
                continue
    save_averagedata(target)
    print('比赛编号%s生涯场均数据爬取完成' % (str(url)))

'''
mongodb存储
'''
def save_matchlist(result):
    collection1.insert_one(result)

def save_basicmatchdetail(result):
    collection2.insert_one(result)

def save_playbyplay(result):
    collection3.insert_one(result)

def save_averagedata(result):
    collection4.insert_one(result)

'''
工作函数
'''
def job_matchlist(url):
    html = get_one_page(url)
    if html:
        parse_matchlist(html)
    else:
        pass

def job_playbyplay(url):
    get_one_page_selenium(url)

def job_basicmatchdetail(url):
    html = get_one_page(url)
    if html:
        parse_basicmatchdetai(html,url)
    else:
        pass

def job_averagedata(url):
    html = get_one_page(url)
    if html:
        parse_averagedata(html,url)
    else:
        pass

'''
入口
'''
global start,end
start = 0
end = 0
def main():
    date = time.strftime('%Y-%m-%d',time.localtime(time.time()))
    year = int(date.split('-')[0])
    month = int(date.split('-')[1])

    # matchlist比赛列表
    for j in range(year, year+1):
        for i in range(5,6):
            if i < 10:
                i = '0' + str(i)
            else:
                i = str(i)
            job_matchlist('http://stat-nba.com/gameList_simple-'+str(j)+'-'+str(i)+'.html')
            print('爬取%s月MatchList数据完成' %(str(i)))
            time.sleep(1)
    for i in range(len(all)):
        if all[i]['content']:
            start = int(all[i]['url'][-1].split('/')[-1].split('.')[0])
            break
        else:
            continue
    for i in range(len(all)-1,-1,-1):
        if all[i]['content']:
            end = int(all[i]['url'][-1].split('/')[-1].split('.')[0])
            break
        else:
            continue
    time.sleep(3)

    # 基础统计数据
    for i in range(start, end+1):
        job_basicmatchdetail('http://stat-nba.com/game/' + str(i) + '.html')
        time.sleep(1)
    time.sleep(3)

    # 时序事件数据
    for i in range (start,end+1):
        job_playbyplay('http://stat-nba.com/game/'+str(i)+'.html')
        time.sleep(3)
    browser.close()
    time.sleep(3)

    # 生涯场均数据
    collection4.drop()
    for i in range(1,5001):
        job_averagedata('http://www.stat-nba.com/player/'+str(i)+'.html')
        time.sleep(1)

if __name__ == '__main__':
    main()

# schedule启动
# schedule.every().sunday.at("18:00").do(main)
# while True:
#     schedule.run_pending()