import Taro, { PureComponent } from '@tarojs/taro'
import { View, Navigator } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import { day } from '@utils/data'
import ajax from '@utils/ajax'
import navigate from '@utils/navigate'
import { get as getGlobalData } from '@utils/global_data.js'
import './index.scss'

export default class Index extends PureComponent {
  constructor(props) {
    super(props)
    let text = '绑定教务处'
    if (Taro.getStorageSync('sid')) {
      text = '获取课程'
    }
    this.state = {
      text
    }
  }
  static defaultProps = {
    now: {},
    logged: false
  }

  getClass = () => {
    if (this.state.text == '获取课程') {
      const sessionid = Taro.getStorageSync('sid')
      const data = {
        func: 'getClass',
        data: {
          sessionid
        }
      }
      ajax('base', data).then(res => {
        const { myClass } = res
        if (myClass) {
          Taro.setStorageSync('myClass', myClass)
          // Taro.setStorageSync('xsid', xsid)
          this.props.dealClassCalendar(myClass)
        } else {
          navigate('登录状态已过期', '../login/login?getClass=1')
        }
      })
    } else {
      Taro.navigateTo({
        url: '../login/login?getClass=1'
      })
    }
  }

  componentDidShow() {
    if (getGlobalData('logged')) {
      this.setState({ text: '获取课程' })
    }
  }

  render() {
    const { now, showDrawer } = this.props
    const { text } = this.state

    return (
      <View className='top'>
        <View className='set' onClick={showDrawer}>
          <AtIcon value='settings' size='19' color='#000' />
          <Text className='txt'>设置</Text>
        </View>
        <View className='main'>
          {now.week ? `第${now.week + 1}周 ${day[now.day]}` : '现在是假期噢~'}
        </View>
        <View className='right' onClick={this.getClass}>
          {text}
        </View>
      </View>
    )
  }
}
