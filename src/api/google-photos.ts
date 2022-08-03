import { GApi } from '@/types/gapi'
import Album = gapi.client.photoslibrary.Album;
import SearchMediaItemsResponse = gapi.client.photoslibrary.SearchMediaItemsResponse;
import axios from 'axios';
export class GooglePhotos {
  private gapi!: GApi;

  initialize (gapi: GApi) {
    this.gapi = gapi

    return this
  }

  getAlbum (albumId: string) {
    return this.handle<Album|null>(
      function (client) {
        return client.albums.get({ albumId }).then(function (response) {
          return response.result
        })
      },
      null
    )
  }

  listAlbums () {
    return this.handle<Album[]>(
      async (client) => {
        const response = await client.albums.list({
          pageSize: 50
        });
        console.log("test");
        const albums = response.result.albums;
        albums?.forEach((album) => {
          const items = this.searchMediaItems(album.id!).then((response) => {
            console.log(album.title);
            console.log(response.mediaItems?.length);
            const mediaItems = response.mediaItems;
            mediaItems?.forEach((mediaItem) => {
              const url = mediaItem.baseUrl;

              axios.head(url!)
                .then(response => (
                  console.log(`size: ${response.headers['content-length']}`)
                ));
            })
          });
        });

        albums?.sort((a, b) => parseFloat(b.mediaItemsCount!) - parseFloat(a.mediaItemsCount!));

        //);
        return albums!;
      },
      []
    )
  }

  listAlbumsComplete () {
    const albumList = this.listAlbums();//.then((values) => { return values});
    // const albums = albumList.then((result) => {
    //   //return result;
    //   result.forEach((album) => {
    //     //let mediaItmes = this.searchMediaItems(album.id)
    //     album.photoCount = 1;
    //   });
    // });

    //return albums;
    return albumList;
  }

  searchMediaItems (albumId: string, pageToken?: string) {
    return this.handle<SearchMediaItemsResponse>(function (client) {
      return client.mediaItems.search({
        resource: {
          albumId,
          pageSize: 100,
          pageToken
        }
      }).then(function (response) {

        return response.result
      })
    })
  }

  /**
   * Handles Google API client calls
   *
   * @param callback invoked with Google Photos client when user is signed in
   * @param defaultResponse return value when user is not signed in
   */
  private handle<T> (callback: (client: typeof gapi.client.photoslibrary) => PromiseLike<T>, defaultResponse?: T) {
    return this.gapi.getGapiClient().then((gapi) => {
      return this.gapi.isSignedIn().then(function (isSignedIn) {
        return isSignedIn ? callback(gapi.client.photoslibrary) : defaultResponse!
      })
    })
  }
}

const googlePhotos = new GooglePhotos()
export default googlePhotos
