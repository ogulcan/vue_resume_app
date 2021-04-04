<template>
  <v-container>
    <v-card flat>
      <v-tabs v-model="tab" exact>
        <v-tab v-for="tab of tabs" :key="tab.id" :to="{ name: tab.route }" exact>
          {{ tab.name }}
        </v-tab>
      </v-tabs>
      <router-view></router-view>
    </v-card>
  </v-container>
</template>

<script>
export default {
  components: {

  },
  data() {
    return {
      tab: "",
      search: null,
      tabs: [
        { id: 1, name: "User List", route: 'userList' },
        { id: 2, name: "Tab List", route: 'tabList'  }
      ]
    }
  },
}
</script>
