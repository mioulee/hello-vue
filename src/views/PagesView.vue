<template>
    <div class="pages-view">
        <header-bar @showTalion="open"></header-bar>
    </div>
</template>
 <script>
 import HeaderBar from '../components/HeaderBar'
 export default {
     name:'pages-view',
     components:{HeaderBar}
 }
 </script>
 
