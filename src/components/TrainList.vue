<template lang="pug">
    .header
        a.back_icon
        .title
          | {{title}}
    .u-info 
        li.u-info-box
            .u-left
                span.f-time {{title}}
</template>

<script>
export default {
    data() {
        return {
            title:'火车列表',
            topbar:'0px',
            trainList:[
                {}
            ]
        }
    }
}
</script>


<style lang="less" scoped>
    @font-color-tt: #051B28;
    @font-color-main: #666;
    @font-color-org: #EB5640;
    .header{
        width:100%;
        left:0;
        position: fixed;
        text-align: center;
        top: 0;
        background-image:linear-gradient(90deg, #FCE105 0%, #FECD15 100%);

        .back_icon{
            position:absolute;
            width:44px;
            height:44px;
            bottom: 0;
            left:0;
            top: 0;
            background-image:~"url(./global_nav_back@2x.png)";
            background-size: 44px,44px;
        }

        .title{
           height: 44px; 
           font-size: 17px;
           color: #222;
           line-height:44px;
        }
    }

    .u-info {
        margin-top: 11px;
        height:auto;
        width:100%;
        -webkit-overflow-scrolling: touch;
        left:0;
        padding-top: 5px;
        bottom:5px;
        position:relative;
        z-index:2;
        li.u-info-box {
            background-color: #fff;
            height:90px;
            margin-bottom:5px;
            position: relative;
            .u-left {
                position:absolute;
                left: 15px;
                top:15px;
                width:230px;
                span{
                    display: inline-block;
                    white-space: nowrap;
                }

                span.f-time{
                    font-size:20px;
                    color:@font-color-tt;
                    position: absolute;
                    top:0;
                }
            }
        }
    }
</style>

