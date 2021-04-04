<template>
  <v-container>
    <v-card class="pa-4">
      <v-btn @click="onAddUserClick" outlined color="grey">
        Add User
      </v-btn>
    </v-card>
    <v-card class="mt-10 elevation-1 pa-4">
      <v-card-title>
        User List
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
            :headers="userTableHeader"
            :items="users">
          <template v-slot:item.actions="{ item }">
            <v-btn @click="onEditUser(item)" outlined color="grey">
              Edit
            </v-btn>
            <v-btn @click="askConfirmation(item)" class="ml-5" outlined color="grey">
              Delete
            </v-btn>
          </template>
        </v-data-table>
      </v-skeleton-loader>
    </v-card>
    <v-dialog v-model="userDialog" width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2">
          <span v-if="isEditMode == false">Add User</span>
          <span v-if="isEditMode">Edit User</span>
        </v-card-title>
        <v-card-text class="mt-5">
          <v-form v-model="isValid" ref="userForm">
            <v-text-field
                v-model="user.id"
                label="ID*"
                :rules="[value => !!value || 'Required']"
                persistent-hint
                required
            ></v-text-field>
            <v-text-field
                v-model="user.name"
                label="Name*"
                :rules="[value => !!value || 'Required']"
                persistent-hint
                required
            ></v-text-field>
            <v-menu
                v-model="expireMenu"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                    v-model="user.picker"
                    readonly
                    label="Expire Date"
                    v-bind="attrs"
                    v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                  v-model="user.picker"
                  @input="expireMenu = false"
              ></v-date-picker>
            </v-menu>
          </v-form>
        </v-card-text>
        <v-alert class="mx-4" type="error" v-if="errorMessage">
          {{ errorMessage }}
        </v-alert>
        <v-alert class="mx-4" type="success" v-if="successMessage">
          {{ successMessage }}
        </v-alert>
        <v-card-actions>
          <v-btn @click="onSaveClick" outlined color="primary">
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
              @click="onDeleteUser"
          >
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import {Timestamp, db} from "../db";

export default {
  components: {

  },
  data() {
    return {
      search: null,
      userTableHeader: [
        {text: 'User ID', value: 'id', width: 100},
        {text: 'Name', value: 'name'},
        {text: 'Expire TS', value: 'picker'},
        {text: 'Actions', value: 'actions'},
      ],
      users: [],
      userWillDelete: null,
      user: {
        id: null,
        name: null,
        ts: null
      },

      errorMessage: null,
      successMessage: null,
      userDialog: false,
      deleteDialog: false,
      expireMenu: false,
      isValid: null,
      isEditMode: false,
      loading: true,
    }
  },
  methods: {
    getUserList() {
      this.loading = true
      db.collection('users')
          .get()
          .then(querySnapshot => {
            this.users = querySnapshot.docs.map(doc => ({
              id: doc.id,
              name: doc.data().name,
              ts: doc.data().ts.seconds,
              picker: new Date(doc.data().ts.seconds*1000).toISOString().substring(0, 10)
            }))
            this.loading = false
          })
    },
    onAddUserClick() {
      this.errorMessage = null
      this.successMessage = null
      this.userDialog = true
    },
    onSaveClick() {
      this.$refs.userForm.validate()

      if (this.isValid) {
        this.errorMessage = null;

        db.collection('users').doc(this.user.id).set({
          name: this.user.name,
          ts: Timestamp.fromDate(new Date(this.user.picker))
        }).then(res => {
          console.log(res)
          this.successMessage = "Successful"
          this.$refs.userForm.reset()
          this.getUserList()
        })
      } else {
        this.errorMessage = "Fill the fields"
      }
    },
    askConfirmation(item) {
      this.userWillDelete = item
      this.deleteDialog = true
    },
    onDeleteUser() {
      this.deleteDialog = false
      db.collection('users')
          .doc(this.userWillDelete.id)
          .delete()
          .then(() => this.getUserList())
    },
    onEditUser(item) {
      this.isEditMode = true
      this.user = item
      this.userDialog = true
    }
  },
  mounted() {
    this.getUserList()
  },
  watch: {
    userDialog: {
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
          this.userWillDelete = null
        }
      }
    }
  }
}
</script>
