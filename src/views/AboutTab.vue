<template>
  <v-container>
    <v-card class="pa-4">
      <v-skeleton-loader
          :loading="loading"
          type="image">
      <v-textarea
          v-model="head"
          outlined
          label="Head"
          value=""
      ></v-textarea>
      <v-textarea
          v-model="content"
          outlined
          label="Content"
          value=""
      ></v-textarea>
      <v-alert type="error" v-if="errorMessage">
        {{ errorMessage }}
      </v-alert>
      <v-alert type="success" v-if="successMessage">
        {{ successMessage }}
      </v-alert>
      <v-btn @click="saveContent" :loading="buttonLoading" outlined color="blue">
        Save
      </v-btn>
      </v-skeleton-loader>
    </v-card>
  </v-container>
</template>
<script>
import {db} from "../db"

export default {
  components: {

  },
  data() {
    return {
      loading: true,
      buttonLoading: false,
      head: null,
      content: null,
      errorMessage: null,
      successMessage: null,
    }
  },
  methods: {
    getAboutTabContent() {
      db.collection('tabs')
      .doc('about')
      .get()
      .then(documentSnapshot => {
        this.head = documentSnapshot.data().head
        this.content = documentSnapshot.data().content
        this.loading = false
      })
    },
    saveContent() {
      this.successMessage = null
      this.errorMessage = null
      this.buttonLoading = true

      db.collection('tabs').doc('about').set({
        head: this.head,
        content: this.content
      }).then(() => {
        this.buttonLoading = false
        this.successMessage = "Updated"
      }).catch(() => {
        this.errorMessage = "An error occured"
      })
    },
  },
  mounted() {
    this.getAboutTabContent()
  },
}
</script>
