import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ArtistData } from '../data/artist-data';
import { AlbumData } from '../data/album-data';
import { TrackData } from '../data/track-data';
import { ResourceData } from '../data/resource-data';
import { ProfileData } from '../data/profile-data';
import { TrackFeature } from '../data/track-feature';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
	expressBaseUrl:string = 'http://localhost:8888';

  constructor(private http:HttpClient) { }

  private sendRequestToExpress(endpoint:string):Promise<any> {
    //TODO: use the injected http Service to make a get request to the Express endpoint and return the response.
    //the http service works similarly to fetch(). It may be useful to call .toPromise() on any responses.
    //update the return to instead return a Promise with the data from the Express server
    //Note: toPromise() is a deprecated function that will be removed in the future.
    //It's possible to do the assignment using lastValueFrom, but we recommend using toPromise() for now as we haven't
    //yet talked about Observables. https://indepth.dev/posts/1287/rxjs-heads-up-topromise-is-being-deprecated
    return firstValueFrom(this.http.get(this.expressBaseUrl + endpoint)).then((response) => {
      return response;
    }, (err) => {
      return err;
    });
  }
  

  aboutMe():Promise<ProfileData> {
    //This line is sending a request to express, which returns a promise with some data. We're then parsing the data 
    return this.sendRequestToExpress('/me').then((data) => {
      return new ProfileData(data);
    });
  }

  searchFor(category:string, resource:string):Promise<ResourceData[]> {
    //TODO: identify the search endpoint in the express webserver (routes/index.js) and send the request to express.
    //Make sure you're encoding the resource with encodeURIComponent().
    //Depending on the category (artist, track, album), return an array of that type of data.
    //JavaScript's "map" function might be useful for this, but there are other ways of building the array.
    let urlString: string = "/search/" + category + "/" + encodeURIComponent(resource);
    return this.sendRequestToExpress(urlString).then((data) => {
      return data[category + "s"]["items"].map((item) => {
        if(category == "album"){
          return new AlbumData(item);
        }
        else if (category=="track"){
          return new TrackData(item);
        }
        else{
          return new ArtistData(item);
        }
      });
      
    });
  }

  getArtist(artistId:string):Promise<ArtistData> {
    //TODO: use the artist endpoint to make a request to express.
    //Again, you may need to encode the artistId.
    let urlString: string = "/artist/" + encodeURIComponent(artistId);
    return this.sendRequestToExpress(urlString).then((data) => {
      return new ArtistData(data);
    });
  }

  getRelatedArtists(artistId:string):Promise<ArtistData[]> {
    //TODO: use the related artist endpoint to make a request to express and return an array of artist data.
    let urlString:string = "/artist-related-artists/" + encodeURIComponent(artistId);
    return this.sendRequestToExpress(urlString).then((data) =>{
      let artistArray:ArtistData[] = [];

      for (let artist of data["artists"]){
        artistArray.push(new ArtistData(artist));
      }
      return artistArray;
    });

  }

  getTopTracksForArtist(artistId:string):Promise<TrackData[]> {
    let urlString:string = "/artist-top-tracks/" + encodeURIComponent(artistId);

    return this.sendRequestToExpress(urlString).then((data) => {
      let trackArray:TrackData[] = [];
      for (let track of data["tracks"]){
        trackArray.push(new TrackData(track));
      }
      return trackArray;
    });
  }

  getAlbumsForArtist(artistId:string):Promise<AlbumData[]> {
    //TODO: use the albums for an artist endpoint to make a request to express.
    let urlString:string = "/artist-albums/" + encodeURIComponent(artistId);

    return this.sendRequestToExpress(urlString).then((data) => {
      let albumArray:AlbumData[] = [];

      for (let album of data["items"]){
        albumArray.push(new AlbumData(album));
      }

      return albumArray;
    })
  }

  getAlbum(albumId:string):Promise<AlbumData> {
    //TODO: use the album endpoint to make a request to express.
    return null as any;
  }

  getTracksForAlbum(albumId:string):Promise<TrackData[]> {
    //TODO: use the tracks for album endpoint to make a request to express.
    return null as any;
  }

  getTrack(trackId:string):Promise<TrackData> {
    //TODO: use the track endpoint to make a request to express.
    return null as any;
  }

  getAudioFeaturesForTrack(trackId:string):Promise<TrackFeature[]> {
    //TODO: use the audio features for track endpoint to make a request to express.
    return null as any;
  }
}
