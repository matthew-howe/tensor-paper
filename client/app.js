import React from 'react'
import Tensor from './components/Tensor'
import {Link, Route} from 'react-router-dom'

import './app.css';

const App = () => {
  return (
    <div>
        <div>
      <a
        className="github-link"
        href="https://github.com/matthew-howe/tensorpaperscissors"
        title="Source on GitHub"
      >
              <img width="149" height="149" src="https://github.blog/wp-content/uploads/2008/12/forkme_right_darkblue_121621.png?resize=149%2C149" className="attachment-full size-full" alt="Fork me on GitHub" data-recalc-dims="1"/>


      </a>
      <header>
        <h2 className="l--page remove-whitespace">
          Play against a <b>Tensorflow Sequential Model.</b><br />{' '}
          <span className="remove-whitespace undertitle">
              Developed by <a className="portfolio"
                  href="http://matthw.com">Matthew Howe</a> and <a className="portfolio"
                  href="https://github.com/dlanoff">Daniel Lanoff.</a>
          </span>
        </h2>

      </header>
  </div>
      <div>
        <Route exact path="/" component={Tensor} />
      </div>
    </div>
  )
}

export default App
