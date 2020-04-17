import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import ajax from '@utils/ajax'
import { AtTabs, AtTabsPane } from 'taro-ui'
import List from '@components/treasure/score/list'
import './score.scss'

export default class Score extends Component {
  config = {
    navigationBarBackgroundColor: '#4e4e6a',
    navigationBarTitleText: '查成绩',
    navigationBarTextStyle: 'white'
  }

  state = {
    all_score: {
      2019: {}
    },
    tabList: [],
    current: 0,
    all_credit: '',
    term: '2019'
  }
  // 获取所有成绩
  getScore = () => {
    const sessionid = Taro.getStorageSync('sid')
    const username = Taro.getStorageSync('username')
    const data = {
      func: 'getScore',
      data: {
        sessionid,
        username
      }
    }
    ajax('base', data).then(res => {
      const { score_arr, all_credit } = res.score
      const all_score = {}
      score_arr.forEach(element => {
        const { term } = element
        if (!all_score[`${term.slice(0, 4)}`]) {
          all_score[`${term.slice(0, 4)}`] = {}
        }
        if (!all_score[`${term.slice(0, 4)}`][`${term.charAt(10)}`]) {
          all_score[`${term.slice(0, 4)}`][`${term.charAt(10)}`] = []
        }
        all_score[`${term.slice(0, 4)}`][`${term.charAt(10)}`].push(element)
      })
      const len = Object.keys(all_score).length
      let tabList = [
        { title: '大一' },
        { title: '大二' },
        { title: '大三' },
        { title: '大四' }
      ]
      tabList = tabList.slice(0, len)
      const term = Object.keys(all_score)[len - 1]
      this.setState({
        all_score,
        all_credit,
        tabList,
        term,
        current: len - 1
      })
    })
  }
  // 显示单科成绩详情
  showBottom = (item, i, element) => {
    const { all_score, term } = this.state
    let needChange = all_score[term][element][i]
    needChange.bottomShow = !item.bottomShow
    this.setState({ all_score })
    // 只有当此成绩的更多信息未显示，且未获取过详情时才发起请求
    if (!item.bottom && !item.getted) {
      const sessionid = Taro.getStorageSync('sid')
      const username = Taro.getStorageSync('username')
      const queryDetail = item.queryDetail + escape(item.score)
      const data = {
        func: 'easyQuery',
        data: {
          sessionid,
          queryDetail,
          spider: 'singleScore',
          username
        }
      }
      ajax('base', data).then(res => {
        const { single_obj, code } = res
        if (code == 200) {
          all_score[term][element][i] = { ...needChange, ...single_obj }
          this.setState({ all_score })
        }
      })
    }
  }
  // tab 切换时改变显示的学期
  changeTabs = e => {
    const { all_score } = this.state
    const term = Object.keys(all_score)[e]
    this.setState({
      current: e,
      term
    })
    Taro.pageScrollTo({
      scrollTop: '40'
    })
  }
  // 左右滑动切换 tab
  touchStart = e => {
    this.start = e.changedTouches[0].pageX
  }
  touchEnd = e => {
    const end = e.changedTouches[0].pageX
    const { current, tabList } = this.state
    // 向左滑
    if (end - this.start > 100 && current != 0) {
      this.changeTabs(current - 1)
    } else if (end - this.start < -100 && current != tabList.length - 1) {
      // 向右滑
      this.changeTabs(current + 1)
    }
  }

  componentWillMount() {
    this.getScore()
  }
  onShareAppMessage() {
    return {
      title: SLOGAN,
      path: PATH
    }
  }

  render() {
    const { all_score, tabList, all_credit, current, term } = this.state

    return (
      <View className='score'>
        <AtTabs current={current} tabList={tabList} onClick={this.changeTabs}>
          <AtTabsPane current={current} index={0}></AtTabsPane>
          <AtTabsPane current={current} index={1}></AtTabsPane>
          <AtTabsPane current={current} index={2}></AtTabsPane>
        </AtTabs>
        <View className='getted'>目前已修学分：{all_credit}学分</View>

        <View
          className='container tac'
          onTouchStart={this.touchStart}
          onTouchEnd={this.touchEnd}
        >
          {Object.keys(all_score[`${term}`]).map(element => (
            <View key={element}>
              <View className='title'>
                {element == 1 ? '上学期' : '下学期'}
              </View>
              {all_score[`${term}`][element].map((item, i) => (
                <List
                  key={item.queryDetail}
                  item={item}
                  i={i}
                  element={element}
                  showBottom={this.showBottom}
                />
              ))}
            </View>
          ))}
        </View>
      </View>
    )
  }
}
