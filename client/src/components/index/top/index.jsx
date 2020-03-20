import Taro, { Component } from '@tarojs/taro'
import { View, Navigator } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import { day } from '@utils/data'
import './index.scss'

export default class Index extends Component {
  static defaultProps = {
    now: {}
  }

  render() {
    const { now, showDrawer } = this.props
    return (
      <View className="top">
        <View className="set" onClick={showDrawer}>
          <AtIcon value="menu" size="23" color="#000"></AtIcon>
          设置
        </View>
        <View className="main">
          {now.week
            ? `第${now.week + 1}周 ${day[now.day]}`
            : '现在是假期噢~'}
        </View>
        <Navigator className="right" url="../login/login?getClass=true&office=1">
          绑定教务处
        </Navigator>
      </View>
    )
  }
}