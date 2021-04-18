<template>
  <v-container>
    <v-card class="pa-4">
      <v-btn @click="onAddExpClick" outlined color="grey">
        Add Experience
      </v-btn>
    </v-card>
    <v-card class="mt-10 elevation-1 pa-4">
      <v-card-title>
        Experience List
        <v-spacer></v-spacer>
        <v-text-field
            v-model="search"
            label="Search"
        ></v-text-field>
      </v-card-title>
      <v-skeleton-loader
          :loading="loading"
          type="table-heading, image, table-tfoot">
        <v-data-table
            :search="search"
            :headers="expTableHeader"
            :items="experiences">
          <template v-slot:item.actions="{ item }">
            <v-btn @click="onEditExperience(item)" outlined color="grey">
              Edit
            </v-btn>
            <v-btn @click="askConfirmation(item)" class="ml-5" outlined color="grey">
              Delete
            </v-btn>
          </template>
        </v-data-table>
      </v-skeleton-loader>
    </v-card>
    <v-dialog v-model="expDialog" width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2">
          <span v-if="isEditMode == false">Add Experience</span>
          <span v-if="isEditMode">Edit Experience</span>
        </v-card-title>
        <v-card-text class="mt-5 pb-0">
          <v-form v-model="isValid" ref="expForm">
            <v-text-field
                v-model="exp.company"
                label="Company*"
                :rules="[value => !!value || 'Required']"
                persistent-hint
                required
            ></v-text-field>
            <v-text-field
                v-model="exp.desc"
                label="Description*"
                :rules="[value => !!value || 'Required']"
                persistent-hint
                required
                onautocomplete="nope"
            ></v-text-field>
            <v-text-field
                v-model="exp.position"
                label="Position*"
                :rules="[value => !!value || 'Required']"
                persistent-hint
                required
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-alert class="mx-4" type="error" v-if="errorMessage">
          {{ errorMessage }}
        </v-alert>
        <v-alert class="mx-4" type="success" v-if="successMessage">
          {{ successMessage }}
        </v-alert>
        <v-card-actions>
          <v-btn class="mb-5 ml-2" @click="onSaveClick" outlined color="primary">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="deleteDialog" width="200">
      <v-card>
        <v-card-title class="headline">
          Are you sure?
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="green darken-1"
              text
              @click="deleteDialog = false"
          >
            No
          </v-btn>
          <v-btn
              color="green darken-1"
              text
              @click="onDeleteExperience"
          >
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import {db} from "../db"

export default {
  components: {

  },
  data() {
    return {
      search: null,
      expTableHeader: [
        {text: 'Timestamp', value: 'id'},
        {text: 'Company', value: 'company'},
        {text: 'Description', value: 'desc'},
        {text: 'Position', value: 'position'},
        {text: 'Actions', value: 'actions'},
      ],
      experiences: [],
      expWillDelete: null,
      exp: {
        company: null,
        desc: null,
        position: null
      },

      errorMessage: null,
      successMessage: null,
      expDialog: false,
      deleteDialog: false,
      isValid: null,
      isEditMode: false,
      loading: true,
    }
  },
  methods: {
    getExpList() {
      this.loading = true
      db.collection('experiences')
          .get()
          .then(querySnapshot => {
            console.log(querySnapshot)
            this.experiences = querySnapshot.docs.map((item) => {
              return item.data()
            });
            this.loading = false
          })
    },
    onAddExpClick() {
      this.errorMessage = null
      this.successMessage = null
      this.expDialog = true
    },
    onSaveClick() {
      this.$refs.expForm.validate()

      if (this.isValid) {
        this.errorMessage = null;

        let timestamp = (this.exp.id != null) ? this.exp.id : new Date().getTime()

        db.collection('experiences').doc(timestamp.toString())
          .set({ id: timestamp, company: this.exp.company, desc: this.exp.desc, position: this.exp.position })
        .then(res => {
          console.log(res)
          this.successMessage = "Successful"
          this.$refs.expForm.reset()
          this.exp.id = null
          this.getExpList()
        })
      } else {
        this.errorMessage = "Fill the fields"
      }
    },
    askConfirmation(item) {
      this.expWillDelete = item
      this.deleteDialog = true
    },
    onDeleteExperience() {
      this.deleteDialog = false

      db.collection('experiences')
        .doc(this.expWillDelete.id.toString())
        .delete()
        .then(() => this.getExpList())
    },
    onEditExperience(item) {
      this.isEditMode = true
      this.exp = item
      this.expDialog = true
    }
  },
  mounted() {
    this.getExpList()
  },
  watch: {
    expDialog: {
      handler: function (to) {
        if (to == true) {
          this.errorMessage = null;
          this.successMessage = null;
        }
      },
      immediate: false,
    },
    deleteDialog: {
      handler: function(to) {
        if (to == false) {
          this.expWillDelete = null
        }
      }
    }
  }
}
</script>
