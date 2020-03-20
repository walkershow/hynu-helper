import Taro, { Component } from '@tarojs/taro'
import { View, Text, Picker } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import ajax from '@utils/ajax'
import './evaluate.scss'

export default class Evaluate extends Component {
  state = {
    arr_xnxq: [],
    arr_pcname: [],
    courseCategories: [],
    selector: ['美国', '中国', '巴西', '日本'],
    selectorChecked: '请选择',
    xnxq: '请选择',
    pcname: '请选择',
    courseCategory: '请选择'
  }

  onChange = e => {
    this.setState({
      selectorChecked: this.state.selector[e.detail.value]
    })
  }

  changeXnxq = e => {
    this.setState({
      xnxq: this.state.arr_xnxq[e.detail.value]
    })
  }
  changePcname = e => {
    this.setState({
      pcname: this.state.arr_pcname[e.detail.value].name
    })
  }
  changeCourse = e => {
    this.setState({
      courseCategory: this.state.courseCategories[e.detail.value].name
    })
  }

  getJxpj = () => {
    Taro.showLoading()
    const sessionid = Taro.getStorageSync('sid')
    const data = {
      func: 'getJxpj',
      data: {
        sessionid
      }
    }
    ajax('base', data).then(res => {
      const { arr_pcname, arr_xnxq, courseCategory } = res
      this.setState({ arr_pcname, arr_xnxq, courseCategory })
    })
  }

  componentWillMount() {
    this.getJxpj()
  }

  render() {
    const {
      selector,
      selectorChecked,
      xnxq,
      arr_xnxq,
      arr_pcname,
      pcname,
      courseCategories,
      courseCategory
    } = this.state
    return (
      <View className="body">
        <View className="page-section">
          <Picker mode="selector" range={arr_xnxq} onChange={this.changeXnxq}>
            <View className="picker">
              学年学期：<Text style={{ color: '#777' }}>{xnxq}</Text>
            </View>
          </Picker>
        </View>
        <View className="page-section">
          <Picker
            mode="selector"
            range={arr_pcname}
            rangeKey="name"
            onChange={this.changePcname}
          >
            <View className="picker">
              评价批次名称：<Text style={{ color: '#777' }}>{pcname}</Text>
            </View>
          </Picker>
        </View>
        <View className="page-section">
          <Picker mode="selector" range={selector} onChange={this.onChange}>
            <View className="picker">
              评价分类名称：
              <Text style={{ color: '#777' }}>{selectorChecked}</Text>
            </View>
          </Picker>
        </View>
        {/* error：显示错误 */}
        <View className="page-section">
          <Picker
            mode="selector"
            range={courseCategories}
            rangeKey="name"
            onChange={this.changeCourse}
          >
            <View className="picker">
              评价课程类别：
              <Text style={{ color: '#777' }}>{courseCategory}</Text>
            </View>
          </Picker>
        </View>
        <AtButton size="normal" type="primary">
          查询
        </AtButton>
      </View>
    )
  }
}