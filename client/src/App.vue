<template>
  <div id="app">
    <component :is="currentPage" />
  </div>
</template>

<script lang="ts" src="./App.ts"></script>
<style lang="scss">
body {
  overflow: hidden;
  margin: 0px;
  font-size: 12px;
}

::-webkit-scrollbar {
  width: 6px;
}

/* Track */
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px grey;
  border-radius: 6px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #201c2b;
  border-radius: 7px;
  opacity: 0.7;
  box-shadow: 0 0 1px 1px hsla(0, 0%, 100%, 0.25);
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #ffffff;
  height: 500px;
  background: #17141f;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #ffffff;
  }
}
</style>
