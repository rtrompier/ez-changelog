/* Package Reader */
var fs = require('fs'),
    findup = require('findup'),
    resolve = require('path').resolve,
    package;

module.exports = {
    getConfig: getConfig,
    getIssueUrl: getIssueUrl,
    getPackage: getPackage,
    getRepoUrl: getRepoUrl,
    getUpdatedVersionName: getUpdatedVersionName
};

//////////

function getPackage(forceGet) {
    if(!package || forceGet) {
        var pkgFile = findup.sync(process.cwd(), 'package.json');
        var pkg = JSON.parse(fs.readFileSync(resolve(pkgFile, 'package.json')));
        package = pkg || {}; /* Cache the read package */
    }
    
    return package;
}

function getConfig() {
    if(!package || !package.config || !package.config['ez-changelog']) {
        console.log('[ez-changelog] WARNING: no config specified in package.json, using defaults');
        return {};
    }

    return package.config['ez-changelog'];
}

function getIssueUrl() {
    if(!package || !package.bugs || !package.bugs.url) {
        console.log('[ez-changelog] WARNING: no bugs url specified in package.json');
        return '';
    }
    
    return package.bugs.url;
}

function getRepoUrl() {
    var repoUrl = '';
    if(!package || !package.repository || !package.repository.url) {
        console.log('[ez-changelog] WARNING: no repository specified in package.json');
        return repoUrl;
    }

    repoUrl = package.repository.url;
    // Remove '/browse' from url (if present)
    var indexOfBrowse = repoUrl.indexOf('\/browse');

    repoUrl = (indexOfBrowse === -1)
        ? repoUrl
        : repoUrl.substring(0, indexOfBrowse);

    // Adjust for stash, bitbucket, or github in repo url (/commits vs /commit)
    repoUrl += (repoUrl.indexOf('github.com') !== -1 )
        ? '/commit'
        : '/commits';

    return repoUrl;
}

function getUpdatedVersionName(isIncremental, tagVersion, buildNumber) {
    if (isIncremental) {
        return (package && package.name) ? package.name + '-' + tagVersion + '.' + buildNumber : tagVersion
    }
    return tagVersion;
}