import React from 'react';
import './Config.css';
import {
  Alert, Button, Select, Spin, Checkbox, Table, Typography,
} from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { fetchData, sendData } from '../restCalls';

const { Option } = Select;
/* eslint max-len: 0 */ // --> OFF
/* eslint class-methods-use-this: 0 */ // --> OFF
/* eslint no-unused-vars: 0 */ // --> OFF
export default class Config extends React.Component {
  async save() {
    this.setState(
      { loading: true },
    );
    try {
      const data = JSON.stringify(this.state.config.config);
      const config = await sendData('/admin/config/save',
        'POST', data);
      this.setState({ config: JSON.parse(config) });
    } catch (e) {
      this.setState({ error: e.message });
      alert('The server likely restarted and you will need to log in again. (A)');
      window.location.reload();
    } finally {
      this.setState(
        { loading: false },
      );
    }
  }

  async saveActiveChannel() {
    this.setState(
      { loading: true },
    );
    try {
      const data = JSON.stringify(this.state.status);
      const status = await sendData('/admin/status/save',
        'POST', data);
      this.setState({ status: JSON.parse(status) });
    } catch (e) {
      this.setState({ error: e.message });
      alert('The server likely restarted and you will need to log in again. (B)');
      window.location.reload();
    } finally {
      this.setState(
        { loading: false },
      );
    }
  }

  commonColumns() {
    return [
      {
        title: 'Parameter Name',
        dataIndex: 'name',
        key: 'name',
        render: (text) => <a>{text}</a>,
      },
      {
        title: 'Parameter Value',
        dataIndex: 'value',
        key: 'value',
        render: (text, meta) => {
          if (meta.key === '1') {
            return (
                            <div>
                                <Select defaultValue={text} style={{ width: 120 }}
                                        onChange={this.handleMainTransportChange}>
                                    <Option value="udp">UDP</Option>
                                    <Option value="tcp">TCP</Option>
                                </Select>
                            </div>);
          }
          if (meta.key === '2' || meta.key === '3') {
            const fieldName = (meta.key === '3' ? 'ffmpeg' : 'ffmpegPre');
            return (
                            <div>
                                <div>
                                    {
                                        this.state.config.config[fieldName]
                                          ? Object.entries(this.state.config.config[fieldName]).map((keyValue, index) => {
                                            const key = keyValue[0];
                                            const value = keyValue[1];
                                            return (<div>
                                                    <Typography.Text
                                                        disabled>{key}
                                                    </Typography.Text>
                                                    <Typography.Text disabled>:</Typography.Text>
                                                    <Typography.Text editable={{
                                                      onChange: (str) => {
                                                        const config = { ...this.state.config };
                                                        if (!config.config[fieldName]) {
                                                          config.config[fieldName] = {};
                                                        }
                                                        config.config[fieldName][key] = str;
                                                        this.save().then();
                                                        this.setState({ config });
                                                      },
                                                    }}>{value}</Typography.Text><Button size={'small'} type={'danger'}
                                                                                        className={'smallButton'}
                                                                                        onClick={
                                                                                            () => {
                                                                                              const config = { ...this.state.config };
                                                                                              if (!config.config[fieldName]) {
                                                                                                config.config[fieldName] = {};
                                                                                              }
                                                                                              delete config.config[fieldName][key];
                                                                                              this.setState({ config });
                                                                                              this.save().then();
                                                                                            }
                                                                                        }>-</Button>
                                                </div>);
                                          }) : <div/>
                                    }
                                    {
                                        <div>
                                            <Typography.Text
                                                editable={{
                                                  onChange: (str) => {
                                                    const ffmpeg = { ...this.state[fieldName] };
                                                    ffmpeg.key = str;
                                                    ffmpeg.itemKey = -1;
                                                    const state = {};
                                                    state[fieldName] = ffmpeg;
                                                    this.setState(state);
                                                  },
                                                }}>{this.state[fieldName] && this.state[fieldName].itemKey === -1 ? this.state[fieldName].key : ''}
                                            </Typography.Text>
                                            <Typography.Text disabled>:</Typography.Text>
                                            <Typography.Text editable={{
                                              onChange: (str) => {
                                                const ffmpeg = { ...this.state[fieldName] };
                                                ffmpeg.value = str;
                                                ffmpeg.valueItem = -1;
                                                const state = {};
                                                state[fieldName] = ffmpeg;
                                                this.setState(state);
                                              },
                                            }}>{this.state[fieldName] && this.state[fieldName].valueItem === -1 ? this.state[fieldName].value : ''}</Typography.Text>
                                            {this.state[fieldName].valueItem === -1 && this.state[fieldName].itemKey === -1
                                              ? <Button onClick={
                                                    () => {
                                                      const ffmpeg = { ...this.state[fieldName] };
                                                      const config = { ...this.state.config };
                                                      if (!config.config[fieldName]) {
                                                        config.config[fieldName] = {};
                                                      }
                                                      config.config[fieldName][ffmpeg.key] = ffmpeg.value;
                                                      this.setState({ config });
                                                      this.save().then(() => {
                                                        const s = {};
                                                        s[fieldName] = {};
                                                        this.setState(s);
                                                      });
                                                    }
                                                }>Add</Button>
                                              : <Button disabled>Add</Button>
                                            }
                                        </div>
                                    }
                                </div>
                            </div>);
          }
          if (meta.key === '4') {
            return (<div>
                            <Checkbox
                                checked={!!this.state.config.config.killAll}
                                onChange={(e) => {
                                  const config = { ...this.state.config };
                                  config.config.killAll = e.target.checked;
                                  this.setState(
                                    { config },
                                  );
                                  this.save().then();
                                }}></Checkbox>
                        </div>);
          }
          if (meta.key === '5') {
            return (<div>
                            <Typography.Text editable={{
                              onChange: async (str) => {
                                this.state.config.config.ffmpegPath = str;
                                await this.save();
                              },
                            }}>{text}</Typography.Text><br/></div>);
          }
          return (<a>{text}</a>);
        },
      }];
  }

  addColumns() {
    const group9 = [];
    const group16 = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 1; i <= 9; i++) {
      group9.push(
        (<Typography.Text editable={{
          onChange: (str) => {
            const newCamera = { ...this.state.newCamera };
            newCamera[`camera${i}`] = str;
            this.setState({ newCamera });
          },
        }}>{this.state.newCamera[`camera${i}`] || ''}</Typography.Text>),
      );
    }
    // eslint-disable-next-line no-plusplus
    for (let i = 1; i <= 16; i++) {
      group16.push(
        (<Typography.Text editable={{
          onChange: (str) => {
            const newCamera = { ...this.state.newCamera };
            newCamera[`camera${i}`] = str;
            this.setState({ newCamera });
          },
        }}>{this.state.newCamera[`camera${i}`] || ''}</Typography.Text>),
      );
    }
    return [{
      title: 'Mode',
      dataIndex: 'mode',
      key: 'mode',
      render: (text) => (<div>
                    <Select defaultValue={text} style={{ width: 120 }}
                            onChange={this.handleCameraChange}>
                        <Option value="single">1 Camera</Option>
                        <Option value="multi4">4 Cameras</Option>
                        <Option value="multi9">9 Cameras</Option>
                        <Option value="multi16">16 Cameras</Option>
                    </Select>
                </div>),
    },
    {
      title: 'rtsp Streams',
      dataIndex: 'rtsp',
      key: 'rtsp',
      render: () => {
        if (this.state.newCamera.mode === 'multi16') {
          return <div>
            {group16.map((value) => <div>{value}<br/></div>)}
          </div>;
        }
        if (this.state.newCamera.mode === 'multi9') {
          return <div>
            {group9.map((value) => <div>{value}<br/></div>)}
          </div>;
        }
        if (this.state.newCamera.mode === 'multi4') {
          return <div>
              <Typography.Text editable={{
                onChange: (str) => {
                  const newCamera = { ...this.state.newCamera };
                  newCamera.camera1 = str;
                  this.setState({ newCamera });
                },
              }}>{this.state.newCamera.camera1 || ''}</Typography.Text>
              <br/>
              <Typography.Text editable={{
                onChange: (str) => {
                  const newCamera = { ...this.state.newCamera };
                  newCamera.camera2 = str;
                  this.setState({ newCamera });
                },
              }}>{this.state.newCamera.camera2 || ''}</Typography.Text>
              <br/>
              <Typography.Text editable={{
                onChange: (str) => {
                  const newCamera = { ...this.state.newCamera };
                  newCamera.camera3 = str;
                  this.setState({ newCamera });
                },
              }}>{this.state.newCamera.camera3 || ''}</Typography.Text>
              <br/>
              <Typography.Text editable={{
                onChange: (str) => {
                  const newCamera = { ...this.state.newCamera };
                  newCamera.camera4 = str;
                  this.setState({ newCamera });
                },
              }}>{this.state.newCamera.camera4 || ''}</Typography.Text>
              <br/>
            </div>;
        }
        return <Typography.Text editable={{
          onChange: (str) => {
            const newCamera = { ...this.state.newCamera };
            newCamera.camera1 = str;
            this.setState({ newCamera });
          },
        }}>{this.state.newCamera.camera1 || ''}</Typography.Text>;
      },
    },
    {
      title: '',
      dataIndex: 'save',
      key: 'save',
      render: () => {
        const mode = this.state.newCamera.mode || 'single';
        let disabled = false;
        if (mode === 'single' && !this.state.newCamera.camera1) {
          disabled = true;
        }
        if (mode === 'multi4'
                        && (!this.state.newCamera.camera1
                            || !this.state.newCamera.camera2
                            || !this.state.newCamera.camera3
                            || !this.state.newCamera.camera4
                        )) {
          disabled = true;
        }
        if (mode === 'multi9'
                        && (!this.state.newCamera.camera1
                            || !this.state.newCamera.camera2
                            || !this.state.newCamera.camera3
                            || !this.state.newCamera.camera4
                            || !this.state.newCamera.camera5
                            || !this.state.newCamera.camera6
                            || !this.state.newCamera.camera7
                            || !this.state.newCamera.camera8
                            || !this.state.newCamera.camera9
                        )) {
          disabled = true;
        }
        if (mode === 'multi16'
                        && (!this.state.newCamera.camera1
                            || !this.state.newCamera.camera2
                            || !this.state.newCamera.camera3
                            || !this.state.newCamera.camera4
                            || !this.state.newCamera.camera5
                            || !this.state.newCamera.camera6
                            || !this.state.newCamera.camera7
                            || !this.state.newCamera.camera8
                            || !this.state.newCamera.camera9
                            || !this.state.newCamera.camera10
                            || !this.state.newCamera.camera11
                            || !this.state.newCamera.camera12
                            || !this.state.newCamera.camera13
                            || !this.state.newCamera.camera14
                            || !this.state.newCamera.camera15
                            || !this.state.newCamera.camera16
                        )) {
          disabled = true;
        }
        return disabled ? (<div>
                        <Button disabled>Save</Button>
                    </div>) : <div><Button onClick={
                        () => {
                          const config = { ...this.state.config };
                          let newItem;
                          if (mode === 'single') {
                            newItem = {
                              streamUrl: this.state.newCamera.camera1,
                            };
                          } else if (mode === 'multi4') {
                            newItem = {
                              streamUrl: [this.state.newCamera.camera1,
                                this.state.newCamera.camera2,
                                this.state.newCamera.camera3,
                                this.state.newCamera.camera4],
                            };
                          } else if (mode === 'multi9') {
                            newItem = {
                              streamUrl: [this.state.newCamera.camera1,
                                this.state.newCamera.camera2,
                                this.state.newCamera.camera3,
                                this.state.newCamera.camera4,
                                this.state.newCamera.camera5,
                                this.state.newCamera.camera6,
                                this.state.newCamera.camera7,
                                this.state.newCamera.camera8,
                                this.state.newCamera.camera9],
                            };
                          } else {
                            newItem = {
                              streamUrl: [this.state.newCamera.camera1,
                                this.state.newCamera.camera2,
                                this.state.newCamera.camera3,
                                this.state.newCamera.camera4,
                                this.state.newCamera.camera5,
                                this.state.newCamera.camera6,
                                this.state.newCamera.camera7,
                                this.state.newCamera.camera8,
                                this.state.newCamera.camera9,
                                this.state.newCamera.camera10,
                                this.state.newCamera.camera11,
                                this.state.newCamera.camera12,
                                this.state.newCamera.camera13,
                                this.state.newCamera.camera14,
                                this.state.newCamera.camera15,
                                this.state.newCamera.camera16,
                              ],
                            };
                          }

                          config.config.channels.push(newItem);
                          this.setState({ config });
                          this.save().then(() => {
                            this.setState({ newCamera: {} });
                          });
                        }
                    }>Save</Button></div>;
      },
    },
    ];
  }

  userColumns() {
    return [
      {
        title: 'Username',
        dataIndex: 'username',
        key: 'username',
        render: (text, data) => (<div><Typography.Text editable={{
          onChange: async (str) => {
            this.state.config.config.users.find(((u) => u.userId === data.userId)).username = str;
            await this.save();
          },
        }}>{text}</Typography.Text><br/></div>),
      },
      {
        title: 'Password',
        dataIndex: 'password',
        key: 'password',
        render: (text, data) => (<div><Typography.Text editable={{
          onChange: async (str) => {
            this.state.config.config.users.find(((u) => u.userId === data.userId)).password = str;
            await this.save();
          },
        }}>*********</Typography.Text><br/></div>),
      },
    ];
  }

  addDatasource() {
    const newCamera = this.state.newCamera;
    return [{
      mode: newCamera.mode || 'single',
      rtsp: [newCamera.camera1,
        newCamera.camera2,
        newCamera.camera3,
        newCamera.camera4,
        newCamera.camera5,
        newCamera.camera6,
        newCamera.camera7,
        newCamera.camera8,
        newCamera.camera9,
        newCamera.camera10,
        newCamera.camera11,
        newCamera.camera12,
        newCamera.camera13,
        newCamera.camera14,
        newCamera.camera15,
        newCamera.camera16,
      ],
    }];
  }

  cameraColumns() {
    return [
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status, meta, pos) => (status
          ? <a target="_blank" rel="noopener noreferrer" href="/camera.html">Current</a>
          : <Button onClick={
                            () => {
                              this.state.status.currentChannel = 1 + pos;
                              this.saveActiveChannel().then();
                            }
                        }>Activate</Button>),
      },
      {
        title: 'Camera',
        dataIndex: 'camera',
        key: 'camera',
        render: (text) => <a>{text}</a>,
      },
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        render: (text, meta, index) => (<div><Typography.Text editable={{
          onChange: async (str) => {
            const config = { ...this.state.config };
            this.state.config.config.channels[index].title = str;
            this.setState({ config });
            this.save();
          },
        }}>{text}</Typography.Text><br/></div>),
      },
      {
        title: 'Camera Mode',
        dataIndex: 'mode',
        key: 'mode',
        render: (text) => {
          if (text === 1) {
            return '1 Camera';
          } if (text === 4) {
            return '4 Cameras';
          } if (text === 9) {
            return '9 Cameras';
          }
          return '16 Cameras';
        },
      },
      {
        title: 'rtsp Streams',
        dataIndex: 'rtsp',
        key: 'rtsp',
        render: (streamUrls, meta, data) => {
          if (streamUrls) {
            if (Array.isArray(streamUrls)) {
              if (streamUrls.length > 1) {
                return streamUrls.map(((streamUrl, i) => <div><Typography.Text editable={{
                  onChange: (str) => {
                    this.state.config.config.channels[data].streamUrl[i] = str;
                    this.save().then();
                  },
                }}>{streamUrl}</Typography.Text><br/></div>));
              }
              return <Typography.Text editable={{
                onChange: (str) => {
                  this.state.config.config.channels[data].streamUrl = str;
                  this.save().then();
                },
              }}>{streamUrls.length > 0 ? streamUrls[0] : ''}</Typography.Text>;
            }
            return <Typography.Text editable={{
              onChange: (str) => {
                this.state.config.config.channels[data].streamUrl = str;
                this.save().then();
              },
            }}>{streamUrls}</Typography.Text>;
          }
          return <a/>;
        },
      },
      {
        title: 'Transport',
        dataIndex: 'transport',
        key: 'transport',
        render: (text, meta, index) => (
                        <div>
                            <Select defaultValue={text} style={{ width: 120 }}
                                    onChange={(value) => {
                                      console.log(`selected ${value}`);
                                      const config = { ...this.state.config };
                                      config.config.channels[index].transport = value;
                                      this.setState(
                                        { config },
                                      );
                                      this.save().then();
                                    }}>
                                <Option value="udp">UDP</Option>
                                <Option value="tcp">TCP</Option>
                            </Select>
                        </div>),
      },
      {
        title: 'RTSP FFmpeg parameters',
        dataIndex: 'ffmpegPre',
        key: 'ffmpegPre',
        render: (text, meta, index) => (<div>
                        <div>
                            {
                                this.state.config.config.channels[index].ffmpegPre
                                  ? Object.entries(this.state.config.config.channels[index].ffmpegPre).map((keyValue) => {
                                    const key = keyValue[0];
                                    const value = keyValue[1];
                                    return (<div>
                                            <Typography.Text
                                                disabled>{key}
                                            </Typography.Text>
                                            <Typography.Text disabled>:</Typography.Text>
                                            <Typography.Text editable={{
                                              onChange: (str) => {
                                                const config = { ...this.state.config };
                                                if (!config.config.channels[index].ffmpegPre) {
                                                  config.config.channels[index].ffmpegPre = {};
                                                }
                                                config.config.channels[index].ffmpegPre[key] = str;
                                                this.save().then();
                                                this.setState({ config });
                                              },
                                            }}>{value}</Typography.Text><Button size={'small'} type={'danger'}
                                                                                className={'smallButton'} onClick={
                                            () => {
                                              const config = { ...this.state.config };
                                              if (!config.config.channels[index].ffmpegPre) {
                                                config.config.channels[index].ffmpegPre = {};
                                              }
                                              delete config.config.channels[index].ffmpegPre[key];
                                              this.setState({ config });
                                              this.save().then();
                                            }
                                        }>-</Button>
                                        </div>);
                                  }) : <div/>
                            }
                            {
                                <div>
                                    <Typography.Text
                                        editable={{
                                          onChange: (str) => {
                                            const ffmpeg = { ...this.state.ffmpegPre };
                                            ffmpeg.key = str;
                                            ffmpeg.itemKey = index;
                                            this.setState({ ffmpegPre: ffmpeg });
                                          },
                                        }}>{this.state.ffmpegPre && this.state.ffmpegPre.itemKey === index ? this.state.ffmpegPre.key : ''}
                                    </Typography.Text>
                                    <Typography.Text disabled>:</Typography.Text>
                                    <Typography.Text editable={{
                                      onChange: (str) => {
                                        const ffmpeg = { ...this.state.ffmpegPre };
                                        ffmpeg.value = str;
                                        ffmpeg.valueItem = index;
                                        this.setState({ ffmpegPre: ffmpeg });
                                      },
                                    }}>{this.state.ffmpegPre && this.state.ffmpegPre.valueItem === index ? this.state.ffmpegPre.value : ''}</Typography.Text>
                                    {this.state.ffmpegPre.valueItem === index && this.state.ffmpegPre.itemKey === index
                                      ? <Button onClick={
                                            () => {
                                              const ffmpeg = { ...this.state.ffmpegPre };
                                              const config = { ...this.state.config };
                                              if (!config.config.channels[index].ffmpegPre) {
                                                config.config.channels[index].ffmpegPre = {};
                                              }
                                              config.config.channels[index].ffmpegPre[ffmpeg.key] = ffmpeg.value;
                                              this.setState({ config });
                                              this.save().then(() => {
                                                this.setState({ ffmpegPre: {} });
                                              });
                                            }
                                        }>Add</Button>
                                      : <Button disabled>Add</Button>
                                    }
                                </div>
                            }
                        </div>
                    </div>),
      },
      {
        title: 'Encode FFmpeg parameters',
        dataIndex: 'ffmpeg',
        key: 'ffmpeg',
        render: (text, meta, index) => {
          const cameraNum = Array.isArray(this.state.config.config.channels[index].streamUrl)
            ? this.state.config.config.channels[index].streamUrl.length : 1;
          return (<div>
                        <Typography.Text
                            disabled>-vf</Typography.Text>
                        <Typography.Text disabled>:</Typography.Text>
                        <Typography.Text
                            disabled>{`scale=${this.state.status.width / cameraNum}:${this.state.status.height / cameraNum}`}</Typography.Text>
                        <br/>

                        <div>
                            {
                                this.state.config.config.channels[index].ffmpeg
                                  ? Object.entries(this.state.config.config.channels[index].ffmpeg).map((keyValue) => {
                                    const key = keyValue[0];
                                    const value = keyValue[1];
                                    return (<div>
                                            <Typography.Text
                                                disabled>{key}
                                            </Typography.Text>
                                            <Typography.Text disabled>:</Typography.Text>
                                            <Typography.Text editable={{
                                              onChange: (str) => {
                                                const config = { ...this.state.config };
                                                if (!config.config.channels[index].ffmpeg) {
                                                  config.config.channels[index].ffmpeg = {};
                                                }
                                                config.config.channels[index].ffmpeg[key] = str;
                                                this.save().then();
                                                this.setState({ config });
                                              },
                                            }}>{value}</Typography.Text><Button size={'small'} type={'danger'}
                                                                                className={'smallButton'} onClick={
                                            () => {
                                              const config = { ...this.state.config };
                                              if (!config.config.channels[index].ffmpeg) {
                                                config.config.channels[index].ffmpeg = {};
                                              }
                                              delete config.config.channels[index].ffmpeg[key];
                                              this.save().then();
                                              this.setState({ config });
                                            }
                                        }>-</Button>
                                        </div>);
                                  }) : <div/>
                            }
                            {
                                <div>
                                    <Typography.Text
                                        editable={{
                                          onChange: (str) => {
                                            const ffmpeg = { ...this.state.ffmpeg };
                                            ffmpeg.key = str;
                                            ffmpeg.itemKey = index;
                                            this.setState({ ffmpeg });
                                          },
                                        }}>{this.state.ffmpeg && this.state.ffmpeg.itemKey === index ? this.state.ffmpeg.key : ''}
                                    </Typography.Text>
                                    <Typography.Text disabled>:</Typography.Text>
                                    <Typography.Text editable={{
                                      onChange: (str) => {
                                        const ffmpeg = { ...this.state.ffmpeg };
                                        ffmpeg.value = str;
                                        ffmpeg.valueItem = index;
                                        this.setState({ ffmpeg });
                                      },
                                    }}>{this.state.ffmpeg && this.state.ffmpeg.valueItem === index ? this.state.ffmpeg.value : ''}</Typography.Text>
                                    {this.state.ffmpeg.valueItem === index && this.state.ffmpeg.itemKey === index
                                      ? <Button onClick={
                                            () => {
                                              const ffmpeg = { ...this.state.ffmpeg };
                                              const config = { ...this.state.config };
                                              if (!config.config.channels[index].ffmpeg) {
                                                config.config.channels[index].ffmpeg = {};
                                              }
                                              config.config.channels[index].ffmpeg[ffmpeg.key] = ffmpeg.value;
                                              this.setState({ config });
                                              this.save().then(() => {
                                                this.setState({ ffmpeg: {} });
                                              });
                                            }
                                        }>Add</Button>
                                      : <Button disabled>Add</Button>
                                    }
                                </div>
                            }
                        </div>
                    </div>);
        },
      },
      {
        title: '',
        dataIndex: 'actions',
        key: 'actions',
        render: (data, meta, index) => {
          const onUp = () => {
            const config = { ...this.state.config };
            const v = config.config.channels[index];
            config.config.channels[index] = config.config.channels[index - 1];
            config.config.channels[index - 1] = v;
            const status = { ...this.state.status };
            if (status.currentChannel - 1 === index) {
              status.currentChannel -= 1;
            }
            this.setState({ config, status });
            this.save().then(() => {
              this.saveActiveChannel().then();
            });
          };
          const onDown = () => {
            const config = { ...this.state.config };
            const v = config.config.channels[index];
            config.config.channels[index] = config.config.channels[index + 1];
            config.config.channels[index + 1] = v;
            const status = { ...this.state.status };
            if (status.currentChannel - 1 === index) {
              status.currentChannel += 1;
            }
            this.setState({ config, status });
            this.save().then(() => {
              this.saveActiveChannel().then();
            });
          };
          return (
                        <div>
                            {index === 0 ? <Button size={'small'} className={'smallButton'} disabled>UP</Button>
                              : <Button size={'small'} className={'smallButton'} onClick={onUp}>UP</Button>}
                            {index === this.state.config.config.channels.length - 1
                              ? <Button size={'small'} className={'smallButton'} disabled>DOWN</Button>
                              : <Button size={'small'} className={'smallButton'} onClick={onDown}>DOWN</Button>}
                            <Button size={'small'} type={'danger'} className={'smallButton'} onClick={() => {
                              const config = { ...this.state.config };
                              config.config.channels = config.config.channels.filter((channel, i) => i !== index);
                              this.setState({ config });
                              this.save().then();
                            }}>Delete</Button>
                        </div>
          );
        },

      }];
  }

  cameraDatasource(loadedConfig) {
    const ret = [];
    if (loadedConfig.channels) {
      loadedConfig.channels.forEach((channel, index) => {
        ret.push({
          status: index + 1 === this.state.status.currentChannel,
          camera: index + 1,
          transport: channel.transport || loadedConfig.transport || 'udp',
          title: channel.title,
          mode: Array.isArray(channel.streamUrl) ? Math.ceil(Math.sqrt(channel.streamUrl.length)) ** 2 : 1,
          rtsp: channel.streamUrl,
          ffmpeg: channel.ffmpeg,
          ffmpegPre: channel.ffmpegPre,
        });
      });
    }
    return ret;
  }

  userDatasource(loadedConfig) {
    return loadedConfig.users;
  }

  commonDatasource(loadedConfig) {
    return [
      {
        key: '1',
        name: 'Default Transport',
        value: loadedConfig.transport,
      },
      {
        key: '2',
        name: 'Default RTSP FFmpeg parameters',
        value: loadedConfig.ffmpegPre,
      },
      {
        key: '3',
        name: 'Default Encode ffmpeg Parameters',
        value: loadedConfig.ffmpeg,
      },
      {
        key: '4',
        name: 'Kill all ffmpeg during restart',
        value: loadedConfig.killAll,
      },
      {
        key: '5',
        name: 'ffmpegPath',
        value: loadedConfig.ffmpegPath,
      },

    ];
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      config: null,
      error: null,
      status: null,
      newCamera: {},
      ffmpeg: {},
      ffmpegPre: {},
    };
    this.save = this.save.bind(this);
    this.handleMainTransportChange = this.handleMainTransportChange.bind(this);
    this.handleCameraChange = this.handleCameraChange.bind(this);
    this.cameraDatasource = this.cameraDatasource.bind(this);
    this.cameraColumns = this.cameraColumns.bind(this);
    this.saveActiveChannel = this.saveActiveChannel.bind(this);
    this.addDatasource = this.addDatasource.bind(this);
    this.commonColumns = this.commonColumns.bind(this);
  }

  async componentDidMount() {
    this.setState(
      { loading: true },
    );
    try {
      const config = await fetchData('/admin/config/get', 'GET');
      const status = await fetchData('/admin/status/get', 'GET');
      this.setState({ config: JSON.parse(config) });
      this.setState({ status: JSON.parse(status) });
    } catch (e) {
      this.setState({ error: e.message });
      alert('The server likely restarted and you will need to log in again. (C)');
      window.location.reload();
    } finally {
      this.setState(
        { loading: false },
      );
    }
  }

  handleMainTransportChange(value) {
    console.log(`selected ${value}`);
    const config = { ...this.state.config };
    config.config.transport = value;
    this.setState(
      { config },
    );
    this.save().then();
  }

  handleCameraChange(value) {
    console.log(`selected ${value}`);
    const newCamera = { ...this.state.newCamera };
    newCamera.mode = value;
    this.setState(
      { newCamera },
    );
  }

  render() {
    const { loading, config, error } = this.state;
    let ret;
    if (loading) {
      ret = <Spin indicator={(<LoadingOutlined style={{ fontSize: 128 }} spin/>)}/>;
    } else if (!config || !config.config) {
      ret = <Alert message="config is empty" type="error"/>;
    } else {
      const loadedConfig = config.config;
      const commonDataSource = this.commonDatasource(loadedConfig);
      const cameraDatasource = this.cameraDatasource(loadedConfig);
      const userDatasource = this.userDatasource(loadedConfig);
      ret = <div>
                        {error ? <Alert message={error} type="error"/> : null
                        }
                        <Typography.Text>Add new Camera</Typography.Text>
                        <br/>
                        <Table columns={this.addColumns()}
                               scroll={{ x: 'max-content' }}
                               dataSource={this.addDatasource()}
                               pagination={{
                                 hideOnSinglePage: true,
                               }}/>
                        <Typography.Text>Camera Settings</Typography.Text>
                        <br/>
                        <Table columns={this.cameraColumns()}
                               scroll={{ x: 'max-content' }}
                               dataSource={cameraDatasource}
                               pagination={{
                                 total: cameraDatasource.length,
                                 pageSize: cameraDatasource.length,
                                 hideOnSinglePage: true,
                               }}/>
                        <br/>
                        <Typography.Text>Common Settings</Typography.Text>
                        <br/>
                        <Typography.Text code>File: {loadedConfig.file}</Typography.Text>
                        <br/>
                        <Table columns={this.commonColumns()}
                               dataSource={commonDataSource}
                               scroll={{ x: 'max-content' }}
                               pagination={{
                                 total: commonDataSource.length,
                                 pageSize: commonDataSource.length,
                                 hideOnSinglePage: true,
                               }}/>
        {loadedConfig.connectionType === 'local' ? <div>
          <Typography.Text>Admin User</Typography.Text>
          <br/>
          <Table columns={this.userColumns()}
                 scroll={{ x: 'max-content' }}
                 dataSource={userDatasource}
                 pagination={{
                   total: userDatasource.length,
                   pageSize: userDatasource.length,
                   hideOnSinglePage: true,
                 }}/>
        </div> : null}
                    </div>;
    }

    return ret;
  }
}
