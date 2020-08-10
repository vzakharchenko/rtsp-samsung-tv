import React from 'react';
import './Config.css';
import {Alert, Button, Select, Spin, Table, Typography} from 'antd';
import {LoadingOutlined} from '@ant-design/icons';
import {fetchData, sendData} from "../restCalls";

const {Option} = Select;


export default class Config extends React.Component {

    async save() {
        this.setState(
            {loading: true}
        );
        try {
            const data = JSON.stringify(this.state.config.config);
            const config = await sendData('/admin/config/save',
                'POST', data);
            this.setState({config: JSON.parse(config)});
        } catch (e) {
            this.setState({error: e.message});
        } finally {
            this.setState(
                {loading: false}
            )
        }
    }

    async saveActiveChannel() {
        this.setState(
            {loading: true}
        );
        try {
            const data = JSON.stringify(this.state.status);
            const status = await sendData('/admin/status/save',
                'POST', data);
            this.setState({status: JSON.parse(status)});
        } catch (e) {
            this.setState({error: e.message});
        } finally {
            this.setState(
                {loading: false}
            )
        }
    }

    commonColumns() {
        return [
            {
                title: 'Parameter Name',
                dataIndex: 'name',
                key: 'name',
                render: text => <a>{text}</a>,
            },
            {
                title: 'Parameter Value',
                dataIndex: 'value',
                key: 'value',
                render: (text, meta) => {
                    if (meta.key === "1") {
                        return (
                            <div>
                                <Select defaultValue={text} style={{width: 120}}
                                        onChange={this.handleMainTransportChange}>
                                    <Option value="udp">UDP</Option>
                                    <Option value="tcp">TCP</Option>
                                </Select>
                            </div>)
                    }
                    if (meta.key === "2" || meta.key === "3") {
                        const fieldName = (meta.key === "3" ? 'ffmpeg' : 'ffmpegPre')
                        return (
                            <div>
                                <div>
                                    {
                                        this.state.config.config[fieldName] ?
                                            Object.entries(this.state.config.config[fieldName]).map((keyValue, index) => {
                                                const key = keyValue[0];
                                                const value = keyValue[1];
                                                return (<div>
                                                    <Typography.Text
                                                        disabled>{key}
                                                    </Typography.Text>
                                                    <Typography.Text disabled>:</Typography.Text>
                                                    <Typography.Text editable={{
                                                        onChange: (str) => {
                                                            const config = {...this.state.config};
                                                            if (!config.config[fieldName]) {
                                                                config.config[fieldName] = {};
                                                            }
                                                            config.config[fieldName][key] = str;
                                                            this.save().then();
                                                            this.setState({config});
                                                        }
                                                    }}>{value}</Typography.Text><Button size={"small"} type={"danger"}
                                                                                        className={"smallButton"}
                                                                                        onClick={
                                                                                            () => {
                                                                                                const config = {...this.state.config};
                                                                                                if (!config.config[fieldName]) {
                                                                                                    config.config[fieldName] = {};
                                                                                                }
                                                                                                delete config.config[fieldName][key];
                                                                                                this.setState({config})
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
                                                        const ffmpeg = {...this.state[fieldName]};
                                                        ffmpeg.key = str;
                                                        ffmpeg.itemKey = -1;
                                                        const state = {};
                                                        state[fieldName] = ffmpeg;
                                                        this.setState(state);
                                                    }
                                                }}>{this.state[fieldName] && this.state[fieldName].itemKey === -1 ? this.state[fieldName].key : ''}
                                            </Typography.Text>
                                            <Typography.Text disabled>:</Typography.Text>
                                            <Typography.Text editable={{
                                                onChange: (str) => {
                                                    const ffmpeg = {...this.state[fieldName]};
                                                    ffmpeg.value = str;
                                                    ffmpeg.valueItem = -1;
                                                    const state = {};
                                                    state[fieldName] = ffmpeg;
                                                    this.setState(state);
                                                }
                                            }}>{this.state[fieldName] && this.state[fieldName].valueItem === -1 ? this.state[fieldName].value : ''}</Typography.Text>
                                            {this.state[fieldName].valueItem === -1 && this.state[fieldName].itemKey === -1 ?
                                                <Button onClick={
                                                    () => {
                                                        const ffmpeg = {...this.state[fieldName]};
                                                        const config = {...this.state.config};
                                                        if (!config.config[fieldName]) {
                                                            config.config[fieldName] = {};
                                                        }
                                                        config.config[fieldName][ffmpeg.key] = ffmpeg.value;
                                                        this.setState({config})
                                                        this.save().then(() => {
                                                            const s = {};
                                                            s[fieldName] = {};
                                                            this.setState(s)
                                                        });
                                                    }
                                                }>Add</Button>
                                                : <Button disabled>Add</Button>
                                            }
                                        </div>
                                    }
                                </div>
                            </div>)
                    }
                    return (<a>{text}</a>);
                }
            }]
    }

    addColumns() {
        return [{
            title: 'Mode',
            dataIndex: 'mode',
            key: 'mode',
            render: (text) => {
                return (<div>
                    <Select defaultValue={text} style={{width: 120}}
                            onChange={this.handleCameraChange}>
                        <Option value="single">1 Camera</Option>
                        <Option value="multi">4 Cameras</Option>
                    </Select>
                </div>)
            }
        },
            {
                title: 'rtsp Streams',
                dataIndex: 'rtsp',
                key: 'rtsp',
                render: () => {
                    return this.state.newCamera.mode === 'multi' ? (
                        <div>
                            <Typography.Text editable={{
                                onChange: (str) => {
                                    const newCamera = {...this.state.newCamera};
                                    newCamera.camera1 = str;
                                    this.setState({newCamera});
                                }
                            }}>{this.state.newCamera.camera1 || ''}</Typography.Text>
                            <br/>
                            <Typography.Text editable={{
                                onChange: (str) => {
                                    const newCamera = {...this.state.newCamera};
                                    newCamera.camera2 = str;
                                    this.setState({newCamera});
                                }
                            }}>{this.state.newCamera.camera2 || ''}</Typography.Text>
                            <br/>
                            <Typography.Text editable={{
                                onChange: (str) => {
                                    const newCamera = {...this.state.newCamera};
                                    newCamera.camera3 = str;
                                    this.setState({newCamera});
                                }
                            }}>{this.state.newCamera.camera3 || ''}</Typography.Text>
                            <br/>
                            <Typography.Text editable={{
                                onChange: (str) => {
                                    const newCamera = {...this.state.newCamera};
                                    newCamera.camera4 = str;
                                    this.setState({newCamera});
                                }
                            }}>{this.state.newCamera.camera4 || ''}</Typography.Text>
                            <br/>
                        </div>) : <Typography.Text editable={{
                        onChange: (str) => {
                            const newCamera = {...this.state.newCamera};
                            newCamera.camera1 = str;
                            this.setState({newCamera});
                        }
                    }}>{this.state.newCamera.camera1 || ''}</Typography.Text>
                }
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
                    if (mode === 'multi' &&
                        (!this.state.newCamera.camera1 ||
                            !this.state.newCamera.camera2 ||
                            !this.state.newCamera.camera3 ||
                            !this.state.newCamera.camera4
                        )) {
                        disabled = true;
                    }
                    return disabled ? (<div>
                        <Button disabled>Save</Button>
                    </div>) : <div><Button onClick={
                        () => {
                            const config = {...this.state.config};
                            let newItem;
                            if (mode === 'single') {
                                newItem = {
                                    streamUrl: this.state.newCamera.camera1,
                                }
                            } else {
                                newItem = {
                                    streamUrl: [this.state.newCamera.camera1,
                                        this.state.newCamera.camera2,
                                        this.state.newCamera.camera3,
                                        this.state.newCamera.camera4]
                                }
                            }

                            config.config.channels.push(newItem);
                            this.setState({config})
                            this.save().then(() => {
                                this.setState({newCamera: {}})
                            })
                        }
                    }>Save</Button></div>
                }
            },]
    }

    addDatasource() {
        const newCamera = this.state.newCamera;
        return [{
            mode: newCamera.mode || 'single',
            rtsp: [newCamera.camera1, newCamera.camera2, newCamera.camera3, newCamera.camera4]
        }]
    }

    cameraColumns() {
        return [
            {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                render: (status, meta, pos) => {
                    return status ?
                        <Typography.Text>Current</Typography.Text>
                        : <Button onClick={
                            () => {
                                this.state.status.currentChannel = pos;
                                this.saveActiveChannel().then()
                            }
                        }>Activate</Button>

                },
            },
            {
                title: 'Camera',
                dataIndex: 'camera',
                key: 'camera',
                render: text => <a>{text}</a>,
            },
            {
                title: 'Camera Mode',
                dataIndex: 'mode',
                key: 'mode',
                render: (text) => <a>{text === 1 ? '1 Camera' : '4 Cameras'}</a>,
            },
            {
                title: 'rtsp Streams',
                dataIndex: 'rtsp',
                key: 'rtsp',
                render: (streamUrls, meta, data) => {
                    if (streamUrls) {
                        if (Array.isArray(streamUrls)) {
                            if (streamUrls.length > 1) {
                                return streamUrls.map(((streamUrl, i) => {
                                    return <div><Typography.Text editable={{
                                        onChange: (str) => {
                                            this.state.config.config.channels[data].streamUrl[i] = str;
                                            this.save().then();
                                        }
                                    }}>{streamUrl}</Typography.Text><br/></div>
                                }))
                            } else {
                                return <Typography.Text editable={{
                                    onChange: (str) => {
                                        this.state.config.config.channels[data].streamUrl = str;
                                        this.save().then();
                                    }
                                }}>{streamUrls.length > 0 ? streamUrls[0] : ''}</Typography.Text>
                            }
                        } else {
                            return <Typography.Text editable={{
                                onChange: (str) => {
                                    this.state.config.config.channels[data].streamUrl = str;
                                    this.save().then();
                                }
                            }}>{streamUrls}</Typography.Text>
                        }
                    } else {
                        return <a/>
                    }
                }
            },
            {
                title: 'Transport',
                dataIndex: 'transport',
                key: 'transport',
                render: (text, meta, index) => {
                    return (
                        <div>
                            <Select defaultValue={text} style={{width: 120}}
                                    onChange={(value) => {
                                        console.log(`selected ${value}`);
                                        const config = {...this.state.config};
                                        config.config.channels[index].transport = value;
                                        this.setState(
                                            {config}
                                        )
                                        this.save().then();
                                    }}>
                                <Option value="udp">UDP</Option>
                                <Option value="tcp">TCP</Option>
                            </Select>
                        </div>)
                }
            },
            {
                title: 'RTSP FFmpeg parameters',
                dataIndex: 'ffmpegPre',
                key: 'ffmpegPre',
                render: (text, meta, index) => {
                    return (<div>
                        <div>
                            {
                                this.state.config.config.channels[index].ffmpegPre ?
                                    Object.entries(this.state.config.config.channels[index].ffmpegPre).map((keyValue) => {
                                        const key = keyValue[0];
                                        const value = keyValue[1];
                                        return (<div>
                                            <Typography.Text
                                                disabled>{key}
                                            </Typography.Text>
                                            <Typography.Text disabled>:</Typography.Text>
                                            <Typography.Text editable={{
                                                onChange: (str) => {
                                                    const config = {...this.state.config};
                                                    if (!config.config.channels[index].ffmpegPre) {
                                                        config.config.channels[index].ffmpegPre = {};
                                                    }
                                                    config.config.channels[index].ffmpegPre[key] = str;
                                                    this.save().then();
                                                    this.setState({config});
                                                }
                                            }}>{value}</Typography.Text><Button size={"small"} type={"danger"}
                                                                                className={"smallButton"} onClick={
                                            () => {
                                                const config = {...this.state.config};
                                                if (!config.config.channels[index].ffmpegPre) {
                                                    config.config.channels[index].ffmpegPre = {};
                                                }
                                                delete config.config.channels[index].ffmpegPre[key];
                                                this.setState({config})
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
                                                const ffmpeg = {...this.state.ffmpegPre};
                                                ffmpeg.key = str;
                                                ffmpeg.itemKey = index;
                                                this.setState({ffmpegPre: ffmpeg});
                                            }
                                        }}>{this.state.ffmpegPre && this.state.ffmpegPre.itemKey === index ? this.state.ffmpegPre.key : ''}
                                    </Typography.Text>
                                    <Typography.Text disabled>:</Typography.Text>
                                    <Typography.Text editable={{
                                        onChange: (str) => {

                                            const ffmpeg = {...this.state.ffmpegPre};
                                            ffmpeg.value = str;
                                            ffmpeg.valueItem = index;
                                            this.setState({ffmpegPre: ffmpeg});
                                        }
                                    }}>{this.state.ffmpegPre && this.state.ffmpegPre.valueItem === index ? this.state.ffmpegPre.value : ''}</Typography.Text>
                                    {this.state.ffmpegPre.valueItem === index && this.state.ffmpegPre.itemKey === index ?
                                        <Button onClick={
                                            () => {
                                                const ffmpeg = {...this.state.ffmpegPre};
                                                const config = {...this.state.config};
                                                if (!config.config.channels[index].ffmpegPre) {
                                                    config.config.channels[index].ffmpegPre = {};
                                                }
                                                config.config.channels[index].ffmpegPre[ffmpeg.key] = ffmpeg.value;
                                                this.setState({config})
                                                this.save().then(() => {
                                                    this.setState({ffmpegPre: {}})
                                                });
                                            }
                                        }>Add</Button>
                                        : <Button disabled>Add</Button>
                                    }
                                </div>
                            }
                        </div>
                    </div>)
                },
            },
            {
                title: 'Encode FFmpeg parameters',
                dataIndex: 'ffmpeg',
                key: 'ffmpeg',
                render: (text, meta, index) => {
                    const cameraNum = Array.isArray(this.state.config.config.channels[index].streamUrl) ?
                        this.state.config.config.channels[index].streamUrl.length : 1
                    return (<div>
                        <Typography.Text
                            disabled>-vf</Typography.Text>
                        <Typography.Text disabled>:</Typography.Text>
                        <Typography.Text
                            disabled>{`scale=${this.state.status.width / cameraNum}:${this.state.status.height / cameraNum}`}</Typography.Text>
                        <br/>

                        <div>
                            {
                                this.state.config.config.channels[index].ffmpeg ?
                                    Object.entries(this.state.config.config.channels[index].ffmpeg).map((keyValue) => {
                                        const key = keyValue[0];
                                        const value = keyValue[1];
                                        return (<div>
                                            <Typography.Text
                                                disabled>{key}
                                            </Typography.Text>
                                            <Typography.Text disabled>:</Typography.Text>
                                            <Typography.Text editable={{
                                                onChange: (str) => {
                                                    const config = {...this.state.config};
                                                    if (!config.config.channels[index].ffmpeg) {
                                                        config.config.channels[index].ffmpeg = {};
                                                    }
                                                    config.config.channels[index].ffmpeg[key] = str;
                                                    this.save().then();
                                                    this.setState({config});
                                                }
                                            }}>{value}</Typography.Text><Button size={"small"} type={"danger"}
                                                                                className={"smallButton"} onClick={
                                            () => {
                                                const config = {...this.state.config};
                                                if (!config.config.channels[index].ffmpeg) {
                                                    config.config.channels[index].ffmpeg = {};
                                                }
                                                delete config.config.channels[index].ffmpeg[key];
                                                this.save().then();
                                                this.setState({config})
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
                                                const ffmpeg = {...this.state.ffmpeg};
                                                ffmpeg.key = str;
                                                ffmpeg.itemKey = index;
                                                this.setState({ffmpeg});
                                            }
                                        }}>{this.state.ffmpeg && this.state.ffmpeg.itemKey === index ? this.state.ffmpeg.key : ''}
                                    </Typography.Text>
                                    <Typography.Text disabled>:</Typography.Text>
                                    <Typography.Text editable={{
                                        onChange: (str) => {

                                            const ffmpeg = {...this.state.ffmpeg};
                                            ffmpeg.value = str;
                                            ffmpeg.valueItem = index;
                                            this.setState({ffmpeg});
                                        }
                                    }}>{this.state.ffmpeg && this.state.ffmpeg.valueItem === index ? this.state.ffmpeg.value : ''}</Typography.Text>
                                    {this.state.ffmpeg.valueItem === index && this.state.ffmpeg.itemKey === index ?
                                        <Button onClick={
                                            () => {
                                                const ffmpeg = {...this.state.ffmpeg};
                                                const config = {...this.state.config};
                                                if (!config.config.channels[index].ffmpeg) {
                                                    config.config.channels[index].ffmpeg = {};
                                                }
                                                config.config.channels[index].ffmpeg[ffmpeg.key] = ffmpeg.value;
                                                this.setState({config})
                                                this.save().then(() => {
                                                    this.setState({ffmpeg: {}})
                                                });
                                            }
                                        }>Add</Button>
                                        : <Button disabled>Add</Button>
                                    }
                                </div>
                            }
                        </div>
                    </div>)
                },
            },
            {
                title: '',
                dataIndex: 'actions',
                key: 'actions',
                render: (data, meta, index) => {
                    const onUp = () => {
                        const config = {...this.state.config};
                        const v = config.config.channels[index];
                        config.config.channels[index] = config.config.channels[index - 1]
                        config.config.channels[index - 1] = v;
                        let status = {...this.state.status};
                        if (status.currentChannel === index) {
                            status.currentChannel = status.currentChannel - 1;
                        }
                        this.setState({config, status})
                        this.save().then(() => {
                            this.saveActiveChannel().then()
                        });
                    };
                    const onDown = () => {
                        const config = {...this.state.config};
                        const v = config.config.channels[index];
                        config.config.channels[index] = config.config.channels[index + 1]
                        config.config.channels[index + 1] = v;
                        let status = {...this.state.status};
                        if (status.currentChannel === index) {
                            status.currentChannel = status.currentChannel + 1;
                        }
                        this.setState({config, status});
                        this.save().then(() => {
                            this.saveActiveChannel().then()
                        });
                    };
                    return (
                        <div>
                            {index === 0 ? <Button size={"small"} className={"smallButton"} disabled>UP</Button> :
                                <Button size={"small"} className={"smallButton"} onClick={onUp}>UP</Button>}
                            {index === this.state.config.config.channels.length - 1 ?
                                <Button size={"small"} className={"smallButton"} disabled>DOWN</Button> :
                                <Button size={"small"} className={"smallButton"} onClick={onDown}>DOWN</Button>}
                            <Button size={"small"} type={"danger"} className={"smallButton"} onClick={() => {
                                const config = {...this.state.config};
                                config.config.channels = config.config.channels.filter((channel, i) => {
                                    return i !== index
                                });
                                this.setState({config})
                                this.save().then();
                            }}>Delete</Button>
                        </div>
                    )
                }

            }]
    }

    cameraDatasource(loadedConfig) {
        const ret = [];
        if (loadedConfig.channels) {
            loadedConfig.channels.forEach((channel, index) => {
                ret.push({
                    status: index === this.state.status.currentChannel,
                    camera: index,
                    transport: channel.transport || loadedConfig.transport || 'udp',
                    mode: Array.isArray(channel.streamUrl) && channel.streamUrl.length > 1 ? 4 : 1,
                    rtsp: channel.streamUrl,
                    ffmpeg: channel.ffmpeg,
                    ffmpegPre: channel.ffmpegPre,
                });
            })
        }
        return ret;
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

        ]
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
            {loading: true}
        )
        try {
            const config = await fetchData('/admin/config/get', 'GET');
            const status = await fetchData('/admin/status/get', 'GET');
            this.setState({config: JSON.parse(config)});
            this.setState({status: JSON.parse(status)});
        } catch (e) {
            this.setState({error: e.message});
        } finally {
            this.setState(
                {loading: false}
            )
        }


    }

    handleMainTransportChange(value) {
        console.log(`selected ${value}`);
        const config = {...this.state.config};
        config.config.transport = value;
        this.setState(
            {config}
        )
        this.save().then();
    }


    handleCameraChange(value) {
        console.log(`selected ${value}`);
        const newCamera = {...this.state.newCamera};
        newCamera.mode = value;
        this.setState(
            {newCamera}
        )
    }

    render() {

        const {loading, config, error} = this.state;
        let ret;
        if (loading) {
            ret = <Spin indicator={(<LoadingOutlined style={{fontSize: 128}} spin/>)}/>
        } else {
            if (!config || !config.config) {
                ret = <Alert message="config is empty" type="error"/>
            } else {
                const loadedConfig = config.config;
                const commonDataSource = this.commonDatasource(loadedConfig);
                const cameraDatasource = this.cameraDatasource(loadedConfig);
                ret =
                    <div>
                        {error ? <Alert message={error} type="error"/> : null
                        }
                        <Typography.Text>Common Settings</Typography.Text>
                        <br/>
                        <Typography.Text code>File: {loadedConfig.file}</Typography.Text>
                        <br/>
                        <Table columns={this.commonColumns()}
                               dataSource={commonDataSource}
                               pagination={{
                                   total: commonDataSource.length,
                                   pageSize: commonDataSource.length,
                                   hideOnSinglePage: true
                               }}/>
                        <br/>
                        <br/>
                        <Typography.Text>Add new Camera</Typography.Text>
                        <br/>
                        <Table columns={this.addColumns()}
                               dataSource={this.addDatasource()}
                               pagination={{
                                   hideOnSinglePage: true
                               }}/>
                        <Typography.Text>Camera Settings</Typography.Text>
                        <br/>
                        <Table columns={this.cameraColumns()}
                               dataSource={cameraDatasource}
                               pagination={{
                                   total: cameraDatasource.length,
                                   pageSize: cameraDatasource.length,
                                   hideOnSinglePage: true
                               }}/>
                    </div>

            }
        }

        return ret;
    }
}
