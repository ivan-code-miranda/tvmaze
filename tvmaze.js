/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default image if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.

  let showsFound = [];

  const response = await axios.get(`http://api.tvmaze.com/search/shows?q=${query}`)
  for (let showResult of response.data){
    const show =  showResult.show
    
    showsFound.push(show)

  }
  return showsFound;
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
             <img class="card-img-top" src="${show.image ? show.image.original : "https://tinyurl.com/tv-missing" }">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button data-toggle="modal" data-target="#myModal" data-show-id="${show.id}" id="get-episodes">Find episodes</button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});


$(document).on("click", "#get-episodes", async function (evt) {
  
  let clickedShowId = $(evt.target).attr("data-show-id");

  let episodes = await getEpisodes(clickedShowId);

  populateEpisodes(episodes);

});







/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
  
  let episodesFound = [];
  
  const response = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`)
  
  for (let episode of response.data){
    
    episodesFound.push(episode);
    
  }
  
  return episodesFound;
  
  // TODO: return array-of-episode-info, as described in docstring above
}

async function populateEpisodes(episodes) {
  
  const $episodesList = $("#episodes-list");
  $episodesList.empty();
  
  $("#episodes-area").attr("style", "display: display");
  
  for (let episode of episodes) {
    let $item = $(`<p>${episode.name} (Season ${episode.season}, Number ${episode.number})</p>`)
    
    $episodesList.append($item);
  }
}