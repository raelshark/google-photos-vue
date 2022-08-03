<template>
    <table>
      <thead>
        <th>Name</th>
        <th>Total Media</th>
        <th>Photos</th>
        <th>Videos</th>
        <th>Size</th>
      </thead>
      <tbody>
        <tr
        :key="album.id"
        :value="album.id"
        v-for="album in albums">
          <td>
            {{ album.title }}
          </td>
          <td>
            {{ album.mediaItemsCount }}
          </td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { createNamespacedHelpers } from 'vuex'
import Album = gapi.client.photoslibrary.Album;

const { mapActions, mapState } = createNamespacedHelpers('photos')

@Component({
  computed: mapState([
    'albums',
    'isSignedIn'
  ]),
  methods: mapActions([
    'listAlbums'
  ])
})
export default class ListAlbums extends Vue {
  readonly albums!: Album[];
  readonly isSignedIn!: boolean;
  @Prop(String) readonly value!: string;

  @Watch('isSignedIn')
  listAlbums!: Function;

  created () {
    this.listAlbums()
  }
}
</script>

<style scoped>
table, th, td {
  table-layout: fixed;
  border: solid 1px #CCC;
  border-collapse: collapse;
}

th, td {
  padding: .25rem;
}

th {
  text-align: center;
}

th:not(:first-of-type) {
  width: 5rem;
}

</style>
