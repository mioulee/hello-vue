import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import TrainList from '@/components/TrainList'
import PagesView from '@/views/PagesView'
import '../assets/common.js'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/',
      name:'PagesView',
      component:PagesView
    },
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
  
  ]
})
