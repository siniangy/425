# coding=UTF-8
from urllib import request,error
import re
import time
import schedule
from bs4 import BeautifulSoup
from pymongo import MongoClient

client = MongoClient('mongodb://127.0.0.1:27017/') # 本地
# client = MongoClient('mongodb://xxxx:27017/') # 阿里云
db = client['match']
collection1 = db['advansmatchdetail']
collection2 = db['matchshotchart']
collection3 = db['matchplaybyplayeng']

'''
date:2019/5/13（爬的很慢）

1：爬取18-19赛季的NBA比赛统计进阶数据写进collection1
2：爬取18-19的NBA比赛投篮事件坐标数据写进collection2
3：爬取18-19的NBA比赛时序事件数据写进collection3
3：数据格式如下：
进阶统计数据
以2019-03-01公牛对老鹰为例
url：https://www.basketball-reference.com/boxscores/201903010ATL.html
db：match
collection：advansmatchdetail
json = {
    'url':'xxxx.html',
    'team1Detail':[[xx1Detail],[xx2Detail]...] ,
    'team1Summary':[[team1Summary]],
    'team2Detail':[[xx1Detail],[xx2Detail]...],
    'team2Summary':[team2Summary]
}

投篮事件坐标数据
以2019-03-01公牛对老鹰为例
url：https://www.basketball-reference.com/boxscores/shot-chart/201903010ATL.html
db: match
collection: matchshotchart
json = {
    'url': 'xxxx.html',
    'team1Img': 'http://d2p3bygnnzw9w3.cloudfront.net/req/1/images/bbr/nbahalfcourt.png',
    'team2Img': 'http://d2p3bygnnzw9w3.cloudfront.net/req/1/images/bbr/nbahalfcourt.png',
    'team1ChartData':[['index'],['topX','leftY'],['content'],['result']],...],
    'team2ChartData':[['index'],['topX','leftY'],['content'],['result']],...]
}

时序事件数据
url：https://www.basketball-reference.com/boxscores/pbp/201903010ATL.html
db: match
collection: matchplaybyplayeng
json = {
    'url': 'xxxx.html',
    'content': [['xx'...],...]
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

'''
解析比赛详情页
'''

## 进阶统计数据
def parse_advansmatchdetail(html,url,team):
    soup = BeautifulSoup(html,'lxml')
    str1 = str(team[0]).lower()
    str2 = str(team[1]).lower()
    if soup.find('div','section_content'):
        target = {}
        target[u'url'] = str(url)
        divAFlag = 'div_box_'+str1+'_advanced'
        tbodyAFlag = 'box_'+str1+'_advanced'
        advansA = soup.find('div',id=divAFlag)
        tbody = advansA.find('table',id=tbodyAFlag).find('tbody')
        tfoot = advansA.find('table',id=tbodyAFlag).find('tfoot')
        team1AdvansDetail = []
        team1AdvansSummary = []
        for tr in tbody.find_all("tr"):
            playerAdvans = []
            playerAdvans.append(tr.find('th').text)
            for td in tr.find_all('td'):
                if td.text.strip() != '':
                    playerAdvans.append(td.text)
                else:
                    playerAdvans.append(str(.0))
            team1AdvansDetail.append(playerAdvans)
        for tr in tfoot.find_all('tr'):
            teamAdvans = []
            teamAdvans.append(tr.find('th').text)
            for td in tr.find_all('td'):
                teamAdvans.append(td.text)
            team1AdvansSummary.append(teamAdvans)
        target[u'team1AdvansDetail'] = team1AdvansDetail
        target[u'team1AdvansSummary'] = team1AdvansSummary

        divBFlag = 'div_box_'+str2+'_advanced'
        tbodyBFlag = 'box_'+str2+'_advanced'
        advansB = soup.find('div', id=divBFlag)
        tbody = advansB.find('table', id=tbodyBFlag).find('tbody')
        tfoot = advansB.find('table', id=tbodyBFlag).find('tfoot')
        team2AdvansDetail = []
        team2AdvansSummary = []
        for tr in tbody.find_all("tr"):
            playerAdvans = []
            playerAdvans.append(tr.find('th').text)
            for td in tr.find_all('td'):
                if td.text.strip() != '':
                    playerAdvans.append(td.text)
                else:
                    playerAdvans.append(str(.0))
            team2AdvansDetail.append(playerAdvans)
        for tr in tfoot.find_all('tr'):
            teamAdvans = []
            teamAdvans.append(tr.find('th').text)
            for td in tr.find_all('td'):
                teamAdvans.append(td.text)
            team2AdvansSummary.append(teamAdvans)
        target[u'team2AdvansDetail'] = team2AdvansDetail
        target[u'team2AdvansSummary'] = team2AdvansSummary

        # 判断是否插入
        if collection1.find({'url':str(url)}).count() == 0:
            print("比赛进阶统计数据%s入库成功" %(str(url)))
            save_advansmatchdetail(target)
        else:
            print("比赛进阶统计数据%s重复入库" %(str(url)))
    else:
        pass

## 投篮事件坐标数据
def parse_matchshotchart(html,url):
    soup = BeautifulSoup(html,'lxml')
    target = {}
    target[u'url'] = url
    i= 0
    divs = soup.find_all('div',class_='shot-area')
    if divs:
        for div in divs:
            i+=1
            # img
            target[u'team'+str(i)+'Img'] = div.find('img')['src']
            # chartData
            target[u'team'+str(i)+'ChartData'] = []
            chartData = []
            j = 0
            for div in div.find_all('div'):
                d = []
                d.append(str(j))
                j+=1
                d.append(div['style'])
                d.append(div['tip'])
                d.append(div.text)
                chartData.append(d)
            target[u'team' + str(i) + 'ChartData'] = chartData
        # 判断是否插入
        if collection2.find({'url':str(url)}).count() == 0:
            print("比赛投篮事件坐标数据%s入库成功" %(str(url)))
            save_matchshotchart(target)
        else:
            print("比赛投篮事件坐标数据%s重复入库" %(str(url)))
    else:
        pass

## 时序事件数据
def parse_playbyplay(html,url):
    soup = BeautifulSoup(html,'lxml')
    target = {}
    target[u'url'] = url
    table = soup.find('table',id='pbp')
    if table:
        playData = []
        for tr in table.find_all('tr'):
            d = []
            for td in tr.find_all('td'):
                if td.text != '\xa0':
                    d.append(td.text)
                else:
                    d.append('')
            if d != []:
                playData.append(d)
        target[u'content'] = playData
        # 判断是否插入
        if collection3.find({'url':str(url)}).count() == 0:
            print("比赛时序事件数据%s入库成功" %(str(url)))
            save_playbyplay(target)
        else:
            print("比赛时序事件数据%s重复入库" %(str(url)))
    else:
        pass

'''
mongodb存储
'''
def save_advansmatchdetail(result):
    collection1.insert_one(result)

def save_matchshotchart(result):
    collection2.insert_one(result)

def save_playbyplay(result):
    collection3.insert_one(result)

'''
获取比赛详情页
'''

## 获取进阶数据页
def get_advansmatchdetail(url,team):
    html = get_one_page(url)
    if html:
        parse_advansmatchdetail(html,url,team)
    else:
        pass

## 获取投篮事件坐标页
def get_matchshotchart(url):
    html = get_one_page(url)
    if html:
        parse_matchshotchart(html,url)
    else:
        pass

## 获取比赛时序数据页
def get_playbyplay(url):
    html = get_one_page(url)
    if html:
        parse_playbyplay(html,url)
    else:
        pass

'''
工作函数
'''
def job(url,year,month,day):
    if day < 10:
        day = '0' + str(day) + '0'
    else:
        day = str(day) + '0'
    if month < 10:
        month = '0' + str(month)
    else:
        month = str(month)
    year = str(year)

    dict = {'Brooklyn':'BRK',
            'Orlando': 'ORL',
            'Boston': 'BOS',
            'San Antonio': 'SAS',
            'Cleveland': 'CLE',
            'Charlotte': 'CHO',
            'Detroit': 'DET',
            'LA Clippers': 'LAC',
            'Golden State': 'GSW',
            'Phoenix': 'PHO',
            'Houston': 'HOU',
            'Indiana': 'IND',
            'Utah': 'UTA',
            'LA Lakers': 'LAL',
            'Dallas': 'DAL',
            'Memphis': 'MEM',
            'Atlanta': 'ATL',
            'Milwaukee': 'MIL',
            'Oklahoma City': 'OKC',
            'Minnesota': 'MIN',
            'Washington': 'WAS',
            'New York': 'NYK',
            'Denver': 'DEN',
            'Portland': 'POR',
            'New Orleans': 'NOP',
            'Sacramento': 'SAC',
            'Miami': 'MIA',
            'Toronto': 'TOR',
            'Philadelphia': 'PHI',
            'Chicago': 'CHI'
            }
    target = []
    html = get_one_page(url)
    if html:
        soup = BeautifulSoup(html,'lxml')
        gameSummary = soup.find('div','game_summaries')
        if gameSummary:
            for div in gameSummary.find_all('div'):
                d = []
                d.append(dict[div.find('tr','winner').find('td').text])
                d.append(dict[div.find('tr','loser').find('td').text])
                target.append(d)
        else:
            target = []
    else:
        pass
    for team in target: # 主队t才是真正的url拼接参数
        for t in team:
            # 进阶统计数据
            string1 = 'https://www.basketball-reference.com/boxscores/%s%s%s%s.html' %(year,month,day,t)
            get_advansmatchdetail(string1,team)
            time.sleep(3)

            # 投篮坐标数据
            string2 = 'https://www.basketball-reference.com/boxscores/shot-chart/%s%s%s%s.html' % (year, month, day, t)
            get_matchshotchart(string2)
            time.sleep(3)

            # 时序事件数据
            string3 = 'https://www.basketball-reference.com/boxscores/pbp/%s%s%s%s.html' % (year, month, day, t)
            get_playbyplay(string3)
            time.sleep(3)

'''
入口
'''
def main():
    date = time.strftime('%Y-%m-%d',time.localtime(time.time()))
    year = int(date.split('-')[0])
    month = int(date.split('-')[1])
    # 日期
    for y in range(year, year+1):
        for m in range(month-1, month):
            for d in range(1,2):
                job('https://www.basketball-reference.com/boxscores/?month='+str(m)+'&day='+str(d)+'&year='+str(y),y,m,d)
                time.sleep(1)

if __name__ == '__main__':
    main()

# schedule启动
# schedule.every().sunday.at("18:00").do(main)
# while True:
#     schedule.run_pending()