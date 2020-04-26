// quick and dirty stub

import { FirebaseNamespace } from '../raw/libraries/firebase/types/app.js';
import { FirebaseAnalytics } from '../raw/libraries/firebase/types/analytics.js';
import { FirebaseFirestore, QueryDocumentSnapshot } from '../raw/libraries/firebase/types/firestore.js';

const { firebase }: { firebase: FirebaseNamespace } = window as any;

export class Lighter {
	public analytics: FirebaseAnalytics = null;
	public firestore: FirebaseFirestore = null;
	public docs: QueryDocumentSnapshot[] = null;

	public async create(): Promise<void> {
		firebase.initializeApp({
			apiKey: 'AIzaSyAHM5sZ39JLrQsR0m8Xy0uaNmxI_0x4i50',
			authDomain: 'jiashe-ng.firebaseapp.com',
			databaseURL: 'https://jiashe-ng.firebaseio.com',
			projectId: 'jiashe-ng',
			storageBucket: 'jiashe-ng.appspot.com',
			messagingSenderId: '814550513437',
			appId: '1:814550513437:web:af93c50dce81733b19d3f4',
			measurementId: 'G-5QQWXLWBMZ',
		});

		this.analytics = (firebase as any).analytics();
		this.firestore = (firebase as any).firestore();

		this.docs = (await this.firestore.collection(this.collection).get()).docs;
	}

	// use the first subdomain to figure out which collection to browse to
	private get collection(): string {
		const {
			href,
		} = window.location;

		const urlParts = href.split('/');

		// remove the empty string at the end of array
		if (urlParts[urlParts.length - 1] === '') {
			urlParts.pop();
		}

		// remove the # items at the end of array
		if (/#|\?/.test(urlParts[urlParts.length - 1])) {
			urlParts.pop();
		}

		const collection = urlParts.pop();

		let domain = href;
		domain = domain.substr(domain.indexOf('//') + 2);
		domain = domain.substr(0, domain.indexOf('/'));

		if (collection.includes(domain)) {
			return 'portfolio';
		}

		return collection;
	}
}
