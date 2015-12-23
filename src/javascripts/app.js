import _ from 'underscore';
import $ from 'jquery';
import file from './file';
import remote from 'remote';
import path from 'path';

const BrowserWindow = remote.require('browser-window');
const Dialog = remote.require('dialog');

$(() => {
  $('#file-select').click(() => {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    const options = { properties: ['openFile', 'multiSelections', 'openDirectory'] };

    Dialog.showOpenDialog(focusedWindow, options, (filepaths) => {
      const $fileList = $('#file-list');

      $fileList.empty();
      _.each(file.flattenFilepaths(filepaths), (filepath) => {
        const filename = path.basename(filepath);

        $fileList.append(`
          <tr>
            <td>
              <div class='before-filename'>${filename}</div>
              <div class='before-filepath'>${filepath}</div>
            </td>
            <td>
              <div class='after-filename'></div>
              <div class='after-filepath'></div>
            </td>
          </tr>
        `);
      });
    });
  });

  $('#replace-button').click(() => {
    const pattern = $('#pattern').val();
    const replacement = $('#replacement').val();
    let regex;

    try {
      regex = new RegExp(pattern);
    } catch (e) {
      if (e.message.match('Invalid regular expression')) {
        alert('正規表現が不正です。');
      } else {
        alert(e);
      }
    }

    _.each($('#file-list tr'), (tr) => {
      const $tr = $(tr);
      const newFilename = $tr.find('.before-filename').text().replace(regex, replacement);
      const filepath = path.dirname($tr.find('.before-filepath').text());

      $tr.find('.after-filename').text(newFilename);
      $tr.find('.after-filepath').text(path.join(filepath, newFilename));
    });
  });
});
