import React from 'react';
import { useEffect, useState } from 'react';
import { Input, Button, Row, Col, Table, Space } from 'antd';
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import './App.css';
import { StudentSocietyDAOContract, StudentERC20Contract, GameItemContract, web3 } from "./utils/contracts";
import assert from 'node:assert';
const GanacheTestChainId = '0x539' // Ganache默认的ChainId = 0x539 = Hex(1337)

// TODO change according to your configuration
const GanacheTestChainName = 'Ganache Test Chain'
const GanacheTestChainRpcUrl = 'http://127.0.0.1:8545'

var dataSource: any[] = [];

const { TextArea } = Input;
function App() {

    const [vote, setVote] = useState(0)
    const [account, setAccount] = useState('')
    const [token, setToken] = useState(-1)

    const [pname, setPname] = useState('')
    const [pdata, setPdata] = useState('')
    const [ptime, setPtime] = useState(0)

    const [pcount, setPcount] = useState(1)
    useEffect(() => {
        // 初始化检查用户是否已经连接钱包
        // 查看window对象里是否存在ethereum（metamask安装后注入的）对象
        const initCheckAccounts = async () => {
            // @ts-ignore
            const { ethereum } = window;
            if (Boolean(ethereum && ethereum.isMetaMask)) {
                // 尝试获取连接的用户账户
                const accounts = await web3.eth.getAccounts()
                if (accounts && accounts.length) {
                    setAccount(accounts[0])
                }
            }
        }

        initCheckAccounts()
    }, [])
    useEffect(() => {
        const getAccountInfo = async () => {
            if (StudentERC20Contract) {
                const ab = await StudentERC20Contract.methods.balanceOf(account).call()
                setToken(ab)
                const a = await StudentSocietyDAOContract.methods.getcountnumber(account).call()
                setPcount(a)
            } else {
                alert('Contract not exists.')
            }
        }
        if (account !== '') {
            getAccountInfo()
        }
    }, [account])

    useEffect(() => {
        const getProposal = async () => {
            if (StudentSocietyDAOContract) {
                const ma = await StudentSocietyDAOContract.methods.getvoteNumber().call()
                setVote(ma)
                /*const a1 = await StudentSocietyDAOContract.methods.getProposer().call()
                console.log(a1)*/
                var response = await StudentSocietyDAOContract.methods.getProposals().call()
                dataSource.length = 0;
                for (let i = 0; i < response.length; i++) {
                    var name = response[i].name
                    var proposer = response[i].proposer
                    var index = response[i].index
                    var startTime = response[i].startTime
                    var date = new Date(startTime * 1000)
                    var test = date.getFullYear() + '-' + (date.getMonth() + 1 < 10 ? '0'
                        + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
                        + date.getDate() + ' '
                        + date.getHours() + ':'
                        + date.getMinutes() + ':'
                        + date.getSeconds()

                    var duration = response[i].duration + "秒"
                    var state
                    if (response[i].end == false) {
                        state = "进行中"
                    } else {
                        if (response[i].success == true) {
                            state = "通过"
                        } else {
                            state = "未通过"
                        }
                    }
                    var agree = response[i].agree
                    var disagree = response[i].disagree
                    var descrip = "提案内容： " + response[i].data
                    dataSource.push({
                        key: i,
                        stockname: name,
                        index: index,
                        stockid: proposer,
                        pricestart: test,
                        priceend: duration,
                        state: state,
                        pricehigh: agree,
                        pricelow: disagree,
                    })
                    dataSource[i].description = descrip;
                }
            } else {
                alert('Contract not exists.')
            }
        }

        getProposal()
    }, [])

    const onClaimTokenAirdrop = async () => {
        if (account === '') {
            alert('You have not connected wallet yet.')
            return
        }

        if (StudentSocietyDAOContract) {
            try {
                await StudentERC20Contract.methods.airdrop().send({
                    from: account
                })
                alert('You have claimed ZJU Token.')
            } catch (error: any) {
                alert(error.message)
            }

        } else {
            alert('Contract not exists.')
        }
    }

    return (
        <div className="App" >

            <Row justify="center" align="middle">
                <Col>
                    用户地址：{account}
                </Col>
                <Col>
                    积分：{token}
                    <Button onClick={onClaimTokenAirdrop}>领取积分</Button>
                </Col>
                <Col>
                    花费10积分发起提案，花费10积分投票。累积提案通过3次，可领取纪念品。
                </Col>
                <Col>
                    <Input
                        size="large"
                        placeholder="提案名称"
                        onChange={(event) => {
                            setPname(event.target.value);
                        }}
                    />
                    <Col>
                        <Input
                            size="large"
                            placeholder="持续时间（秒）"
                            onChange={(event) => {
                                setPtime(parseInt (event.target.value));
                            }}
                        />
                    </Col>
                    <Button onClick={async () => {
                        try {
                            await StudentERC20Contract.methods.approve(StudentSocietyDAOContract.options.address, 10).send({
                                from: account
                            })

                            await StudentSocietyDAOContract.methods.BeginProposal(ptime, pname, pdata).send({
                                from: account
                            })

                            alert('You have begun a proposal.')
                        } catch (error: any) {
                            alert(error.message)
                        }
                    }}>提交</Button>
                </Col>

                <Col>
                    <TextArea
                        cols={100}
                        rows={10}

                        placeholder="提案内容"
                        //maxLength={6}
                        onChange={(event) => {
                            setPdata(event.target.value);;
                        }}
                    />
                </Col>
                <Col>
                    用户通过提案数：{pcount}
                    <Button onClick={async () => {
                        try {
                            if (pcount >= 3) {
                                await GameItemContract.methods.awardItem(account, "ZJU").send({
                                    from: account
                                })
                                alert('领取成功')
                            } else {
                                
                                alert('提案通过次数不足')
                            }
                        } catch (error: any) {
                            alert(error.message)
                        }
                    }}>领取纪念品</Button>
                </Col>
                <br />
                <br />
                <br />
                <Col>
                    <Button onClick={async () => {
                        try {
                            await StudentSocietyDAOContract.methods.CheckProposal().send({
                                from:account
                            })

                            alert('Check down')
                        } catch (error: any) {
                            alert(error.message)
                        }
                    }}>检查提案</Button>
                </Col>
                <div style={{ whiteSpace: 'pre-wrap' }}>
                    
                    <Table
                        size='small'
                        columns={[//change
                            {
                                title: '名称',
                                width: 200,
                                dataIndex: 'stockname',
                                key: 'stockname',
                                align: 'center',
                            },
                            {
                                title: '提案人',
                                width: 200,
                                dataIndex: 'stockid',

                                key: 'stockid',
                                align: 'center',
                            },
                            {
                                title: '序号',
                                width: 200,
                                dataIndex: 'index',
                                sorter: (a, b) => a.index - b.index,
                                sortDirections: ['ascend'],
                                key: 'index',
                                align: 'center',
                            },
                            {
                                title: '开始时间',
                                width: 200,
                                dataIndex: 'pricestart',
                                key: 'pricestart',
                                align: 'center',
                            },
                            {
                                title: '持续时间',
                                width: 200,
                                dataIndex: 'priceend',
                                key: 'priceend',
                                align: 'center',
                            },
                            {
                                title: '状态',
                                width: 200,
                                dataIndex: 'state',
                                key: 'state',
                                align: 'center',
                            },
                            {
                                title: '赞成',
                                width: 200,
                                dataIndex: 'pricehigh',
                                key: 'pricehigh',
                                align: 'center',
                            },
                            {
                                title: '反对',
                                width: 200,
                                dataIndex: 'pricelow',
                                key: 'pricelow',
                                align: 'center',
                            },
                            {
                                title: '投票',
                                width: 200,
                                key: 'action',
                                render: (text, record) => (
                                    <Space size="middle" >
                                        <a onClick={async () => {
                                            try {
                                                await StudentERC20Contract.methods.approve(StudentSocietyDAOContract.options.address, 10).send({
                                                    from: account
                                                })
                                                await StudentSocietyDAOContract.methods.VoteProposal(record.index, 0).send({
                                                    from: account
                                                })
                                                alert('You have voted.')
                                            } catch (error: any) {
                                                alert(error.message)
                                            }
                                        }}>赞成</a>
                                        <a onClick={async () => {
                                            await StudentERC20Contract.methods.approve(StudentSocietyDAOContract.options.address, 10).send({
                                                from: account
                                            })
                                            await StudentSocietyDAOContract.methods.VoteProposal(record.index, 1).send({
                                                from: account
                                            })
                                        }}>反对</a>
                                    </Space>

                                ),
                            },

                        ]}
                        dataSource={dataSource}
                        bordered title={() => '提案列表'}
                        expandable={{
                            expandedRowRender: (record) => (
                                <p style={{ margin: 0, }}>{record.description}</p>
                            ),
                        }}
                    />
                </div>
            </Row>

        </div>
    );
}

export default App;
