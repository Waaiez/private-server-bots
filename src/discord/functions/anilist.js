const fetch = require('node-fetch');
const Bluebird = require('bluebird');

fetch.Promise = Bluebird;

const currentWatching = async () => {
	let list;
	const query = `query ($name: String!, $listType: MediaType) {
        MediaListCollection(userName: $name, type: $listType, status: CURRENT) {
          lists {
            entries {
              mediaId
              status
              progress
              media {
                title {
                  romaji
                  english
                }
              }
            }
          }
        }
      }`;

	await fetch('https://graphql.anilist.co', {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			accept: 'application/json',
		},
		body: JSON.stringify({
			query,
			variables: {
				name: 'Waaiez',
				listType: 'ANIME',
			},
		}),
	})
		.then((res) => res.json())
		.then((res) => (list = res.data.MediaListCollection.lists[0].entries));

	return list;
};

exports.currentWatching = currentWatching;
