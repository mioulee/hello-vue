<template lang="pug">
.u-app-main
    .header
        a.back_icon
        .title {{title}}
    .u-info(v-for='item in screenData')
        li.u-info-box
            .u-left
                span.f-time.time-start {{item.startTime}}
                span.f-time.time-end {{item.arriveTime}}
                    font.u-add(v-if='item.arriveDays > 0') +{{item.arriveDays}}天
                span.f-place.place-start {{item.fromStationName}}
                span.f-place.place-end {{item.toStationName}}
                span.ico-line
                    em.ico-circle-solid
                    em.ico-circle-hollow
                span.f-train-time {{item.runTimeName}}
                span.f-train-shift
                    font {{item.trainCode}}
                    font.identity-icon(v-if="item.accessByIdcard==='Y'")
            .u-price
                span.adsult
                    font.u-c-org ￥
                    font.u-s-org {{item.lowestPrice}}起
                span.children 分期￥230起
            .u-bottom-info
                template(v-for="ele in trainList")
                    span.f-seat(v-if="ele > 29") 二等座：有票
                    span.f-seat(v-if="ele>10&ele<29") 一等座：{{ele}}
                    span.f-seat(v-if="ele == 0") 特等座：0张
    mt-popup.u-pop-screen(
        v-model="filterSwitch"
        position="bottom"
        popup-transition="popup-fade"
    )

        .u-info-result 共
            span.u-c-yellow {{filterData.length}}
            |个结果
            span.btn-cancel(@click="filterSwitch = !filterSwitch") 取消
            span.btn-confirm(@click="clickConfirmBtn()") 确定
        .u-screen-box(:style="{'max-height':'460px'}")
            span.u-train-t1 仅显示有票列车
                mt-switch
                .u-main-box(:style="{'padding-bottom':bottomBar}")
                template(v-for="item in AllConditions")
                    span.u-train-tt 
                        font.f-tt {{item.name}}
                    li.u-train-m()
                        span.u-chk-box(@click="changeCheckList(item.name,item.conditions,element)" v-for="element in item.conditions")
                            em.ico-gou(:class="{'checked':element.checked}")
                            font.chk-f1 {{element.label}}

    .footer 
        .u-tab.u-time(
            @click="sortTime()"
            :class="{'sortTop':sortTimeType,'sortBottom':!sortTimeType,'isCheck':sortTimeSwitch}"
            )
            .ico-bot.ico-sort
            |{{sortTimeTxt}}
        .u-tab.u-price(
            @click="sortPrice()"
            :class="{'sortTop':sortPriceType,'sortBottom':!sortPriceType,'isCheck':sortPriceSwitch}"
            )
            .ico-bot.ico-sort
            |{{sortPriceTxt}}
        .u-tab.u-consuming(
            @click="sortDuration()"
            :class="{'sortTop':sortDurationType,'sortBottom':!sortDurationType,'isCheck':sortDurationSwitch}"
            )
            .ico-bot.ico-sort
            |{{sortDurationTxt}}
        .u-tab(
            @click="filterToggleOn()"
            :class="{'isCheck':filterSwitch}"
            )
            .ico-bot.ico-screen
            |筛选
    
</template>

<script>
export default {
  data() {
    return {
      title: "火车列表",
      topbar: "0px",
      trainList: [],//请求的列表源数据
      screenData: [],//要显示到屏幕的列表数据
      filterData:[],//筛选之后的暂时保存的数据，如果点击确定就将其赋值给screenData
      lowestPrice: 339,
      searchUrlParams: {
        departCity: "SHA",
        arriveCity: "SIA",
        fromStation: "NJH",
        toStation: "SHH",
        trainDate: "2018-07-29",
        requestType: "0"
      },
      resultNum:0,//筛选的结果数
      sortTimeSwitch: false,
      sortTimeType: false, //true,表示时间从早到晚，false，反之
      sortTimeTxt: "时间",
      sortPriceSwitch: false,
      sortPriceType: false, //true,表示价格从低到高，false，反之
      sortPriceTxt: "价格",
      sortDurationSwitch: false,
      sortDurationType: false, //true,表示耗时从低到高，false，反之
      sortDurationTxt: "耗时",
      filterSwitch: false,
      url: "http://10.32.16.107:10901/tps/app/btc/train/trainList",

      departTimeFilterConditions: [],
      trainTypeFilterConditions: [],
      arriveTimeFilterConditions: [],
      departCityConditions: [],
      arriveCityConditions: [],
      seatTypeCondition: [],

      AllConditions: [
        {
          name: "车次类型",
          type: "train_num",
          conditions: [
            {
              label: "不限",
              checked: true
            },
            {
              label: "高铁(G/C)",
              checked: false
            },
            {
              label: "动车(D)",
              checked: false
            },
            {
              label: "普通(Z/T/K)",
              checked: false
            },
            {
              label: "其他(L/Y等)",
              checked: false
            }
          ]
        },

        {
          name: "出发时刻",
          conditions: [
            {
              label: "不限",
              checked: true
            },
            {
              label: "00:00~06:00",
              checked: false
            },
            {
              label: "06:00~12:00",
              checked: false
            },
            {
              label: "12:00~18:00",
              checked: false
            },
            {
              label: "18:00~24:00",
              checked: false
            }
          ]
        },

        {
          name: "到达时刻",
          conditions: [
            {
              label: "不限",
              checked: true
            },
            {
              label: "00:00~06:00",
              checked: false
            },
            {
              label: "06:00~12:00",
              checked: false
            },
            {
              label: "12:00~18:00",
              checked: false
            },
            {
              label: "18:00~24:00",
              checked: false
            }
          ]
        },

        {
          name: "出发车站",
          conditions: [
            {
              label: "不限",
              checked: true
            }
          ]
        },

        {
          name: "到达车站",
          conditions: [
            {
              label: "不限",
              checked: true
            }
          ]
        },

        {
          name: "坐席类型",
          conditions: [
            {
              label: "不限",
              checked: true
            }
          ]
        }
      ]
    };
  },
  methods: {
    httpGetTrainList() {
      let self = this;
      self.$http.post(self.url, self.searchUrlParams).then(function(resp) {
        if (resp.data.success == false) {
          alert(resp.data.msg);
          return;
        }
        self.trainList = resp.data.data.trainInfoList;
        self.trainList.forEach(item => {
          item["runTimeName"] =
            Math.floor(item.runTimeMinute / 60) +
            "时" +
            Math.floor(item.runTimeMinute % 60) +
            "分";
        });
        self.screenData = self.trainList
        self.filterData = self.trainList
        //预处理筛选框显示数据
        self.prepareCondition();
      });
    },

    //预处理筛选框显示数据
    prepareCondition() {
      let self = this;
      var fromStation = new Set();
      var toStation = new Set();
      var seat = new Set();
      self.trainList.forEach(item => {
        fromStation.add(item.fromStationName);
        toStation.add(item.toStationName);
        item.seatsInfo.forEach(item => {
          seat.add(item.seatTypeName);
        });
      });
      fromStation.forEach(item => {
        var condition = {
          label: item,
          checked: false
        };
        self.AllConditions[3].conditions.push(condition);
      });
      toStation.forEach(item => {
        self.AllConditions[4].conditions.push({
          label: item,
          checked: false
        });
      });
      seat.forEach(item => {
        self.AllConditions[5].conditions.push({ label: item, checked: false });
      });
    },
    sortTime() {
      if (!this.sortTimeSwitch) {
        this.sortTimeSwitch = true;
        this.sortPriceSwitch = false;
        this.sortDurationSwitch = false;
        this.filterSwitch = false;

        this.sortPriceTxt = "价格";
        this.sortDurationTxt = "耗时";
      }
      this.sortTimeType = !this.sortTimeType;

      this.getSortTimeTxt();
      this.sortData();
    },

    getSortTimeTxt() {
      if (this.sortTimeSwitch) {
        if (this.sortTimeType) {
          this.sortTimeTxt = "时间从早到晚";
        } else {
          this.sortTimeTxt = "时间从晚到早";
        }
      } else {
        this.sortTimeTxt = "时间";
      }
    },
    sortPrice() {
      if (!this.sortPriceSwitch) {
        this.sortTimeSwitch = false;
        this.sortPriceSwitch = true;
        this.sortDurationSwitch = false;
        this.filterSwitch = false;

        this.sortTimeTxt = "时间";
        this.sortDurationTxt = "耗时";
      }
      this.sortPriceType = !this.sortPriceType;
      this.getSortPriceTxt();

      this.sortData();
    },

    getSortPriceTxt() {
      if (this.sortPriceSwitch) {
        if (this.sortPriceType) {
          this.sortPriceTxt = "价格从低到高";
        } else {
          this.sortPriceTxt = "价格从高到低";
        }
      } else {
        this.sortPriceTxt = "价格";
      }
    },

    sortDuration() {
      if (!this.sortDurationSwitch) {
        this.sortTimeSwitch = false;
        this.sortPriceSwitch = false;
        this.sortDurationSwitch = true;
        this.filterSwitch = false;

        this.sortTimeTxt = "时间";
        this.sortPriceTxt = "价格";
      }
      this.sortDurationType = !this.sortDurationType;
      this.getSortDurationTxt();

      this.sortData();
    },

    sortData() {
      if (this.sortTimeSwitch) this.sortDataByTime();
      if (this.sortPriceSwitch) this.sortDataByPrice();
      if (this.sortDurationSwitch) this.sortDataByDuration();
    },

    //时间排序比较器
    timeComparator(x, y) {
      if (x.startTime > y.startTime) return 1;
      else if (x.startTime < y.startTime) return -1;
      else return 0;
    },
    //按时间排序
    sortDataByTime() {
      this.screenData = this.trainList;
      this.screenData.sort(this.timeComparator);
    },

    //按价格排序
    sortDataByPrice() {
      let that = this;
      this.screenData = this.trainList;
      var comparator = function(x, y) {
        if (x.lowestPrice - y.lowestPrice > 0) return 1;
        else if (x.lowestPrice - y.lowestPrice < 0) return -1;
        else return that.timeComparator(x, y);
      };
      this.screenData.sort(comparator);
    },

    //按耗时排序
    sortDataByDuration() {
      let that = this;
      this.screenData = this.trainList;
      var comparator = function(x, y) {
        if (x.runTimeMinute - y.runTimeMinute > 0) return 1;
        else if (x.runTimeMinute - y.runTimeMinute < 0) return -1;
        else return that.timeComparator(x, y);
      };
      this.screenData.sort(comparator);
    },

    getSortDurationTxt() {
      if (this.sortDurationSwitch) {
        if (this.sortDurationType) {
          this.sortDurationTxt = "耗时从低到高";
        } else {
          this.sortDurationTxt = "耗时从高到低";
        }
      } else {
        this.sortDurationTxt = "耗时";
      }
    },

    filterToggleOn() {
      if (!this.filterSwitch) {
        this.sortTimeSwitch = false;
        this.sortPriceSwitch = false;
        this.sortDurationSwitch = false;
        this.filterSwitch = true;

        this.sortTimeTxt = "时间";
        this.sortPriceTxt = "价格";
        this.sortDurationTxt = "耗时";
      }
    },

    changeCheckList(type, conditions, element) {
      if (element.label === "不限") {
        if (element.checked) {
          return;
        } else {
          element.checked = true;
          conditions.forEach((item, index) => {
            if (index != 0) {
              item.checked = false;
            }
          });
        }
      }
      element.checked = !element.checked;

      var flag = false;
      conditions.forEach(item => {
        if (item.checked) {
          flag = true;
        }
      });
      if (!flag) {
        conditions[0].checked = true;
      } else {
        conditions[0].checked = false;
      }

      //将选中条件置于对应的集合中
      if(type == "车次类型") {
        this.trainTypeFilterConditions.splice(0,this.trainTypeFilterConditions.length);
      }
      if(type == "出发时刻") {
        this.departTimeFilterConditions.splice(0,this.departTimeFilterConditions.length);
      }
      if(type == "到达时刻") {
        this.arriveTimeFilterConditions.splice(0,this.arriveTimeFilterConditions.length);
      }
      if(type == "出发车站") {
        this.departCityConditions.splice(0, this.departCityConditions.length);
      }
      if(type == "到达车站") {
        this.arriveCityConditions.splice(0, this.arriveCityConditions.length);
      }
      if(type == "坐席类型") {
        this.seatTypeCondition.splice(0, this.seatTypeCondition.length);
      }
      conditions.forEach((item, index) => {
        if (type == "车次类型") {
          if ((index != 0) & (item.checked == true)) {
            this.trainTypeFilterConditions.push(item.label);
          }
        }
        if (type == "出发时刻") {
          if ((index != 0) & (item.checked == true)) {
            this.departTimeFilterConditions.push(item.label);
          }
        }
        if (type == "到达时刻") {
          if ((index != 0) & (item.checked == true)) {
            this.arriveTimeFilterConditions.push(item.label);
          }
        }
        if (type == "出发车站") {
          if ((index != 0) & (item.checked == true)) {
            this.departCityConditions.push(item.label);
          }
        }
        if (type == "到达车站") {
          if ((index != 0) & (item.checked == true)) {
            this.arriveCityConditions.push(item.label);
          }
        }
        if (type == "坐席类型") {
          if ((index != 0) & (item.checked == true)) {
            this.seatTypeCondition.push(item.label);
          }
        }
      });
      this.doFilterData();
    },

    
    //根据选中的筛选条件去筛选screenData中数据
    doFilterData() {
      this.filterData = this.trainList.filter(item => {
        // return this.doFilterByDepartTime(item.startTime)&&this.doFilterByArriveTime(item.arriveTime)&&this.doFilterByDepartCity(item.fromStationName)
        return this.doFilterByTrainType(item)&&this.doFilterByDepartTime(item.startTime)
               &&this.doFilterByArriveTime(item.arriveTime)&&this.doFilterByDepartCity(item.fromStationName)&&this.doFilterByArriveCity(item.toStationName)&&this.doFilterBySeatType(item)
      });
    },
    doFilterByTrainType(item) {
      if(this.trainTypeFilterConditions.length == 0) {
        return true
      }
      var trainType
      if(['G','C'].contains(item.trainCode.charAt(0))) {
        trainType = "高铁(G/C)"
      }else if(item.trainType === 'D') {
        trainType = "动车(D)"
      }else if(['Z','T','K'].contains(item.trainType)) {
        trainType = "普通(Z/T/K)"
      }else {
        trainType = "其他(L/Y等)"
      }
      return this.trainTypeFilterConditions.contains(trainType)
    },
    doFilterByDepartTime(startTime) {
        var flag = true;
        var length = this.departTimeFilterConditions.length
        for(var j=0;j < length;j++){
          var times = this.departTimeFilterConditions[j].split('~')
          if(times[0].localeCompare(startTime)<0&&times[1].localeCompare(startTime)>=0) {
            flag = true
            break
          }else {
            flag = false
          }
        }
        return flag
    },
    doFilterByArriveTime(arriveTime){
        var flag = true;
        var length = this.arriveTimeFilterConditions.length
        for(var j=0;j < length;j++){
          flag = false
          var times = this.arriveTimeFilterConditions[j].split('~')
          if(times[0].localeCompare(arriveTime)<0&&times[1].localeCompare(arriveTime)>=0) {
            flag = true
            break
          }else {
            flag = false
          }
        }
        return flag
    },
    doFilterByDepartCity(departCity){
      if(this.departCityConditions.length == 0) {
        return true
      }
      return this.departCityConditions.contains(departCity)
    },
    doFilterByArriveCity(arriveCity){
      if(this.arriveCityConditions.length == 0) {
        return true
      }
      return this.arriveCityConditions.contains(arriveCity)
    },
    doFilterBySeatType(item){
      if(this.seatTypeCondition.length == 0) {
        return true
      }
      for(var i=0,len=item.seatsInfo.length;i<len;i++) {
        if(this.seatTypeCondition.contains(item.seatsInfo[i].seatTypeName)) {
          return true
        }
      }
      return false
    },
    clickConfirmBtn() {
      this.screenData = this.filterData
      this.filterSwitch = !this.filterSwitch
    }
  },
  mounted() {
    Array.prototype.contains = function(needle) {
        var flag = false;
        this.forEach(item=>{
          if(item == needle) {
            flag = true;
          }
        })
        return flag;
    }
    this.httpGetTrainList();
  }
};
</script>


<style lang="less" scoped>
@font-color-tt: #051b28;
@font-color-main: #666;
@font-color-org: #eb5640;
body,
html {
  height: auto !important;
  margin: 0;
}
.u-app-main {
  height: 100%;
  width: 100%;
}
.header {
  width: 100%;
  left: 0;
  position: fixed;
  text-align: center;
  top: 0;
  z-index: 10001;
  background-image: linear-gradient(90deg, #fce105 0%, #fecd15 100%);

  .back_icon {
    position: absolute;
    width: 44px;
    height: 44px;
    bottom: 0;
    left: 0;
    top: 0;
    background-image: ~"url(./global_nav_back@2x.png)";
    background-size: 44px, 44px;
  }

  .title {
    height: 44px;
    font-size: 17px;
    color: #222;
    line-height: 44px;
  }
}

.u-info {
  margin-top: 11px;
  height: auto;
  width: 100%;
  -webkit-overflow-scrolling: touch;
  left: 0;
  padding-top: 5px;
  bottom: 5px;
  position: relative;
  z-index: 2;
  li.u-info-box {
    background-color: #fff;
    height: 90px;
    width: 100%;
    margin-bottom: 5px;
    position: relative;
    .u-left {
      position: absolute;
      left: 15px;
      top: 15px;
      width: 230px;
      span {
        display: inline-block;
        white-space: nowrap;
      }

      span.f-time {
        font-size: 20px;
        color: @font-color-tt;
        position: absolute;
      }

      span.f-time.time-start {
        top: 0;
        left: 0;
      }

      span.f-time.time-end {
        right: 0;
        float: right;

        font.u-add {
          color: #999;
          font-size: 10px;
          position: absolute;
          top: -3px;
          right: -23px;
        }
      }

      span.f-place {
        font-size: 12px;
        color: @font-color-main;
        position: absolute;
        top: 25px;
      }

      span.f-place.place-start {
        left: 0;
      }

      span.f-place.place-end {
        right: 0;
      }

      span.ico-line {
        width: 80px;
        height: 1px;
        background-color: #ddd;
        position: absolute;
        left: 75px;
        top: 18px;

        em.ico-circle-solid {
          width: 5px;
          height: 5px;
          position: absolute;
          background-color: #ddd;
          right: 0;
          top: -2px;
          border-radius: 100px;
        }

        em.ico-circle-hollow {
          width: 3px;
          height: 3px;
          position: absolute;
          left: 0;
          top: -2px;
          border-radius: 100px;
          background-color: #fff;
          border: 1px solid #ddd;
        }
      }

      span.f-train-time {
        font-size: 10px;
        color: #666;
        width: 80px;
        text-align: center;
        left: 75px;
        position: absolute;
      }

      span.f-train-shift {
        width: 80px;
        font-size: 10px;
        width: 80px;
        text-align: center;
        left: 75px;
        position: absolute;
        top: 20px;
        font {
          display: inline-block;
        }

        .identity-icon {
          position: relative;
          width: 15px;
          height: 10px;
          top: 1px;
          margin-left: 3px;
          background: url(./identification@3x.png);
          background-repeat: no-repeat;
          background-size: 15px 10px;
        }
      }
    }

    .u-price {
      position: absolute;
      float: left;
      right: 0px;
      top: 15px;

      .adsult {
        display: block;
        overflow: hidden;
        text-align: right;
        float: right;
      }

      .u-c-org {
        color: @font-color-org;
        position: relative;
        top: 1px;
      }

      .u-s-org {
        font-size: 20px;
        font-weight: 600;
      }

      .children {
        color: #999;
        display: block;
        overflow: hidden;
        text-align: right;
        position: absolute;
        float: right;
        top: 28px;
        right: 0px;
        font-size: 12px;
      }
    }

    .u-bottom-info {
      position: absolute;
      bottom: 5px;
      left: 15px;
      font-size: 10px;
      color: #666;
      width: 345px;
      height: 20px;

      .f-seat {
        white-space: nowrap;
        float: left;
        margin: 0, 0, 50px, 0;
        line-height: 10px;
        width: 33%;
      }
    }
  }
}

.u-app-main .footer {
  bottom: 0px;
  position: fixed;
  display: flex;
  width: 100%;
  left: 0px;
  background-color: #fff;
  border-top: 1px solid #eee;
  z-index: 1000;
  transition: all 0.5s;

  .u-tab {
    flex: 1;
    font-size: 10px;
    text-align: center;
  }

  .ico-bot {
    width: 20px;
    height: 20px;
    background-size: 100%;
    display: block;
    background-repeat: no-repeat;
    margin: 7px auto 2px;
  }

  .u-tab.u-consuming {
    .ico-sort {
      background-image: ~"url(./ticket_query_consuming@3x.png)";
    }
  }

  .u-tab.u-time {
    .ico-sort {
      background-image: ~"url(./ticket_tab_shijianpaixu@3x.png)";
    }
  }

  .u-tab.u-price {
    .ico-sort {
      background-image: ~"url(./ticket_tab_jiagepaixu@3x.png)";
    }
  }

  // .u-tab.u-filter {
  //   .ico-screen {
  //     background-image: ~"url(./ticket_tab_shuaixuan_nochoose@3x.png)";
  //   }
  // }

  .ico-screen {
    background-image: ~"url(./ticket_tab_shuaixuan_nochoose@3x.png)";
  }

  .sortTop.isCheck {
    .ico-sort {
      background-image: ~"url(./ticket_tab_didaogao@3x.png)";
    }
  }

  .sortBottom.isCheck {
    .ico-sort {
      background-image: ~"url(./ticket_tab_gaodaodi@3x.png)";
    }
  }

  .isCheck {
    .ico-screen {
      background-image: ~"url(./ticket_tab_shuaixuan_choose@3x.png)";
    }
  }
}

.u-app-main .footer-show {
  height: 50px;
  transition: all 0.5s;
}

.u-pop-screen {
  width: 100%;
  .u-info-result {
    display: block;
    height: 35px;
    font-size: 14px;
    text-align: center;
    line-height: 35px;
    background-color: #f5f5f5;
    color: #999;
    position: absolute;
    left: 0px;
    width: 100%;
    z-index: 1010;
  }

  .u-c-yellow {
    color: #101010;
    font-size: 15px;
    margin: 0 3px;
  }

  .btn-cancel {
    position: relative;
    float: left;
    left: 15px;
    color: #101010;
  }

  .btn-confirm {
    position: relative;
    float: right;
    right: 15px;
    color: #101010;
  }
}

.u-screen-box {
  background-color: #fff;
  border-top: 1px solid #eee;
  position: relative;
  padding-left: 26px;
  overflow: auto;
  text-align: left;

  .u-f-tt {
    color: #222;
    font-weight: 300;
    font-size: 14px;
  }
  .u-train-m {
    display: block;
    text-align: left;
    font-weight: 300;
    .u-chk-box {
      width: 50%;
      display: inline-block;
      margin-bottom: 12px;
      .ico-gou {
        width: 13px;
        height: 13px;
        border: 1px solid #fecd15;
        border-radius: 3px;
        display: inline-block;
        margin-right: 10px;
        position: relative;
        top: 2px;
      }
      .checked {
        background-image: url("./checkbox@3x.png");
        background-size: 100%;
      }
    }
  }
  .u-train-tt {
    line-height: 35px;
    color: #222222;
    font-size: 14px;
    display: block;
    overflow: hidden;
    position: relative;

    .f-tt {
      display: inline-block;
      position: relative;
      padding-right: 10px;
      z-index: 2;
      background-color: #fff;
    }
  }
  .u-train-tt:before {
    content: "";
    display: block;
    height: 1px;
    background-color: #eee;
    overflow: hidden;
    position: absolute;
    width: 100%;
    top: 18px;
  }

  .u-train-t1 {
    position: relative;
    font-size: 14px;
    display: block;
    margin-bottom: 15px;
    margin-top: 30px;

    .mint-switch {
      display: inline-block;
      position: absolute;
      left: 180px;
      .mint-switch-core {
        width: 40px;
        height: 20px;
      }
      .mint-switch-core::before {
        width: 34px;
        height: 8px;
        background-color: transparent;
      }
      .mint-switch-core::after {
        width: 15px;
        height: 15px;
        top: 1px;
        margin-left: 1px;
      }
      .mint-switch-input:checked + .mint-switch-core {
        border-color: #f7cd4a;
        background-color: #f7cd4a;
      }
    }
  }
}

.mint-indicator-mask {
  top: 105px !important;
}
</style>

