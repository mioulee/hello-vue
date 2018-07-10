import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import TrainList from '@/components/TrainList'
import '../assets/common.js'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/',
      name:'TrainList',
      component:TrainList
    },
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
  
  ]
})
