import createHistory from 'history/createBrowserHistory';
import {PAGES} from './pages/pages';
let browserHistory = createHistory();

const createBrowserHistory = (basePath = '') => {
    browserHistory = createHistory({
        basename: ![''].includes(basePath) ? `/${basePath}/` : basePath
    });
    return browserHistory;
};


const getCurrentPage = (pages = PAGES) => {
    const currPath = browserHistory.location.pathname;
    if (!currPath) return;
    const [, pageLink] = currPath.split('/');

    let result = '';

    for (let i = 0; i < pages.length; i++) {
        let page = pages[i];

        if (`/${pageLink}` === page.navigationLink || `/${pageLink}` === page.path) {
            result = page.name;
            break;
        } else {
            if (currPath.indexOf(page.path + '/') != -1) {
                result = page.name;
            }
        }
    }
    return result;
};

export {browserHistory, getCurrentPage, createBrowserHistory};
