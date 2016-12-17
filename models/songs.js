var mongoose = require('mongoose');
var songsSchema = mongoose.Schema({
  name:{
    type:String,
    required:true,
    default : null
  },
  price:{
    type:Number,
    default :1
  },
  songPath:{
    type:String,
    default : null
  },
  artist:{
    type:String,
    required:true
  },
  album:{
    type:mongoose.Schema.Types.ObjectId
  }
});
var Song = module.export = mongoose.model('Song',songsSchema);
//Get artists
module.exports.getSongs = function(callback,limit){
  Song.find(callback).limit(limit);
}
module.exports.getSongById = function(id,callback){
  Song.findById(id,callback);
}
module.exports.addSong = function(song,callback){
  Song.create(song,callback);
}
module.exports.updateSong = function(id,song,options,callback){
  var query = {_id :id };
  var update = {'$set' :song};
  Song.findOneAndUpdate(query,update,options,callback);
}
module.exports.getSongById = function(id,callback){
  Song.findById(id,callback);
}
module.exports.deleteSong = function(id, callback){
  var query = {_id: id};
  Song.remove(query, callback);
};
module.exports.findSongByArtistName = function(name,callback){
  var query = {artist : name};
  Song.find(query,callback);
}
module.exports.updateSongByArtist = function(artistName,newArtistName,callback){
  Song.update({artist:artistName},{"$set":{artist:newArtistName}},{multi:true},callback);
}
module.exports.updateSongByAlbumName = function(id,newAlbumName,callback){
  Song.update({_id:id},{"$set":{album:newAlbumName}},{multi:true},callback);
}
