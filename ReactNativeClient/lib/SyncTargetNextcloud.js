const BaseSyncTarget = require('lib/BaseSyncTarget.js');
const { _ } = require('lib/locale.js');
const Setting = require('lib/models/Setting.js');
const { FileApi } = require('lib/file-api.js');
const { Synchronizer } = require('lib/synchronizer.js');
const WebDavApi = require('lib/WebDavApi');
const { FileApiDriverWebDav } = require('lib/file-api-driver-webdav');

class SyncTargetNextcloud extends BaseSyncTarget {

	static id() {
		return 5;
	}

	constructor(db, options = null) {
		super(db, options);
		// this.authenticated_ = false;
	}

	static targetName() {
		return 'nextcloud';
	}

	static label() {
		return _('Nextcloud (Beta)');
	}

	isAuthenticated() {
		return true;
		//return this.authenticated_;
	}

	async initFileApi() {
		const options = {
			baseUrl: () => Setting.value('sync.5.path'),
			username: () => Setting.value('sync.5.username'),
			password: () => Setting.value('sync.5.password'),
		};

		const api = new WebDavApi(options);
		const driver = new FileApiDriverWebDav(api);
		const fileApi = new FileApi('', driver);
		fileApi.setSyncTargetId(SyncTargetNextcloud.id());
		fileApi.setLogger(this.logger());
		return fileApi;
	}

	async initSynchronizer() {
		return new Synchronizer(this.db(), await this.fileApi(), Setting.value('appType'));
	}

}

module.exports = SyncTargetNextcloud;