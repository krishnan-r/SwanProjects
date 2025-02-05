// Copyright (c) SWAN Development Team.
// Author: Omar.Zapata@cern.ch 2021
import { ReactWidget } from '@jupyterlab/apputils';
import * as React from 'react';
import { JSONObject } from '@lumino/coreutils';
import { Card, HelpTooltip } from './Components';
export interface IStackOptions {
  visible: boolean;
}
import { swanProjectIcon, sftIcon, cmsIcon } from './icons';

import { ProjectDialog } from './ProjectDialog';

import Select from 'react-select';

/**
 * React ProjectWidget.
 */
export class ProjectWidget extends ReactWidget {
  /**
   * Constructs a new ProjectWidget.
   */
  options: ProjectDialog.ISWANOptions;
  releases: JSONObject[];
  platforms: JSONObject[];
  clicked: boolean;
  constructor(options: ProjectDialog.ISWANOptions) {
    super();
    this.clicked = false;
    this.addClass('jp-ReactWidget');

    this.setOptions(options);
    this.selectStack = this.selectStack.bind(this);
    this.changeRelease = this.changeRelease.bind(this);
    this.changePlatform = this.changePlatform.bind(this);
    this.changeName = this.changeName.bind(this);
    this.changeUserScript = this.changeUserScript.bind(this);
    this.changeClicked = this.changeClicked.bind(this);
  }

  /**
   * returns the project values, such as name, stack, release ...
   */
  getOptions(): ProjectDialog.ISWANOptions {
    return this.options;
  }

  /**
   * fill the form with project values, such as name, stack, release ...
   */
  setOptions(options: ProjectDialog.ISWANOptions): void {
    this.options = options;
    if (this.options.stack === undefined || this.options.stack === '') {
      this.options.stack = 'LCG';
    }
    this.selectStack(this.options.stack);
    this.update();
  }

  /**
   * method to change stack, allows to handle the information
   * in the Select component for platform and release
   */
  selectStack(source: string): void {
    this.options.stack = source;

    //check is source on staks else error
    const releases = Object.keys(
      this.options.stacks_options[this.options.stack]
    ) as string[];
    this.releases = [];
    releases.forEach(release => {
      this.releases.push({ value: release, label: release });
    });

    this.options.release = releases[0];

    const stackValues = this.options.stacks_options[
      this.options.stack
    ] as JSONObject;

    //check is stack on keys, else error
    const platforms = stackValues[this.options.release] as string[];

    this.platforms = [];
    platforms.forEach(platform => {
      this.platforms.push({ value: platform, label: platform });
    });
    this.options.platform = platforms[0];

    this.update();
  }

  /**
   * method to change release in the Select component
   */
  changeRelease(event: { value: string; label: string }): void {
    this.options.release = event.value;
    const stackValues = this.options.stacks_options[
      this.options.stack
    ] as JSONObject;
    //check is stack on keys, else error
    const platforms = stackValues[this.options.release] as string[];
    this.platforms = [];
    platforms.forEach(platform => {
      this.platforms.push({ value: platform, label: platform });
    });
    this.options.platform = platforms[0];
    this.update();
  }

  /**
   * method to change platform in the Select component
   */
  changePlatform(event: { value: string; label: string }): void {
    this.options.platform = event.value;

    this.update();
  }

  /**
   * method to change name in the input text.
   */
  changeName(event: React.ChangeEvent<HTMLInputElement>): void {
    this.options.name = event.target.value;
  }

  /**
   * method to change text in the text area for the user script.
   */
  changeUserScript(event: React.ChangeEvent<HTMLTextAreaElement>): void {
    this.options.user_script = event.target.value;
  }

  /**
   * method to indicated that the
   */
  changeClicked(): void {
    this.clicked = true;
    this.parent.parent.close();
  }
  render(): JSX.Element {
    return (
      <span className="sw-Dialog-body">
        <table>
          <tbody>
            <tr>
              <td align="center">
                <swanProjectIcon.react
                  className="sw-Dialog-project-icon"
                  tag="span"
                />
              </td>
              <td colSpan={3}>
                <div className="sw-Dialog-project-name">
                  <input
                    type="text"
                    defaultValue={this.options.name}
                    placeholder="Project Name"
                    onChange={this.changeName}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td colSpan={1}>
                <div style={{ float: 'left' }}>
                  {Card('LCG', sftIcon, this.selectStack)}
                </div>
              </td>
              <td colSpan={1}>
                <div style={{ float: 'left' }}>
                  {Card('CMSSW', cmsIcon, this.selectStack)}
                </div>
              </td>
              <td colSpan={1}></td>
              <td colSpan={1}></td>
            </tr>
            <tr>
              <td className="sw-Dialog-tooltip" colSpan={2}>
                <br />
                <div style={{ display: 'flex' }}>
                  <div> Release </div>
                  <div className="sw-Dialog-release-tooltip">
                    {' '}
                    {HelpTooltip(
                      'release',
                      'Software stack: TODO! <br/> \
                                    No message yet.<br/> \
                                    ;('
                    )}{' '}
                  </div>
                </div>
              </td>
              <td className="sw-Dialog-tooltip" colSpan={2}>
                <br />
                Platform
              </td>
            </tr>
            <tr className="sw-Dialog-select">
              {/* https://react-select.com/advanced#portaling */}
              <td colSpan={2}>
                <Select
                  isSearchable={false}
                  options={this.releases as any}
                  menuPortalTarget={document.body}
                  menuPosition={'absolute'}
                  styles={{
                    menuPortal: (base: any): any => ({
                      ...base,
                      zIndex: 999999
                    })
                  }}
                  menuShouldScrollIntoView={false}
                  defaultValue={{
                    value: this.options.release,
                    label: this.options.release
                  }}
                  value={{
                    value: this.options.release,
                    label: this.options.release
                  }}
                  onChange={this.changeRelease}
                />
              </td>
              <td colSpan={2}>
                {
                  <Select
                    isSearchable={false}
                    options={this.platforms as any}
                    menuPortalTarget={document.body}
                    menuPosition={'absolute'}
                    styles={{
                      menuPortal: (base: any): any => ({
                        ...base,
                        zIndex: 999999
                      })
                    }}
                    menuShouldScrollIntoView={false}
                    defaultValue={{
                      value: this.options.platform,
                      label: this.options.platform
                    }}
                    value={{
                      value: this.options.platform,
                      label: this.options.platform
                    }}
                    onChange={this.changePlatform}
                  />
                }
              </td>
            </tr>
            <tr>
              <td className="sw-Dialog-userscript" colSpan={4}>
                <div
                  className="sw-Dialog-userscript-title"
                  style={{ display: 'flex' }}
                >
                  <div> User environment </div>
                  <div className="sw-Dialog-userscript-tooltip">
                    {' '}
                    {HelpTooltip('bash_script', 'User environment script')}{' '}
                  </div>
                </div>
                <textarea
                  className="userScript"
                  placeholder="#!/bin/bash &#10;Bash user script code here"
                  style={{
                    width: '100%',
                    height: '100%',
                    minWidth: '420px',
                    minHeight: '300px',
                    padding: '5px 0px 5px 0px',
                    resize: 'none'
                  }}
                  onChange={this.changeUserScript}
                  defaultValue={this.options.user_script}
                />
              </td>
            </tr>
            <tr>
              <td colSpan={4}>
                <div style={{ float: 'right' }}>
                  <br />
                  <br />
                  <button
                    type="button"
                    className="jp-mod-styled"
                    onClick={this.changeClicked}
                  >
                    Add
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </span>
    );
  }
}
