<template lang="pug">
.u-app-main
    .header
        a.back_icon
        .title {{title}}
    .u-info 
        li.u-info-box
            .u-left
                span.f-time.time-start 12:30
                span.f-time.time-end 14:15
                    font.u-add +1天
                span.f-place.place-start 北京
                span.f-place.place-end 上海
                span.ico-line
                    em.ico-circle-solid
                    em.ico-circle-hollow
                span.f-train-time 3时12分
                span.f-train-shift
                    font G430
                    font.identity-icon
            .u-price
                span.adsult
                    font.u-c-org ￥
                    font.u-s-org {{lowestPrice}}起
                span.children 分期￥230起
            .u-bottom-info
                template(v-for="ele in trainList")
                    span.f-seat(v-if="ele > 29") 二等座：有票
                    span.f-seat(v-if="ele>10&ele<29") 一等座：{{ele}}
                    span.f-seat(v-if="ele == 0") 特等座：0张
            
</template>

<script>
export default {
  data() {
    return {
      title: "火车列表",
      topbar: "0px",
      trainList: [12,30,0],
      lowestPrice: 339
    };
  }
};
</script>


<style lang="less" scoped>
@font-color-tt: #051b28;
@font-color-main: #666;
@font-color-org: #eb5640;
.u-app-main {
  height: 100%;
}
.header {
  width: 100%;
  left: 0;
  position: fixed;
  text-align: center;
  top: 0;
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
        bottom:5px;
        left:15px;
        font-size: 10px;
        color: #666;
        width:345px;
        height:20px;

        .f-seat {
            white-space: nowrap;
            float: left;
            margin:0,0,50px,0;
            line-height: 10px;
            width: 33%;
        }
    }
  }
}
</style>

