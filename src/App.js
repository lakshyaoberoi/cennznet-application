import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Api, ApiRx } from "@cennznet/api";
import "./App.css";
import "antd/dist/antd.css";

import { Layout, Menu } from "antd";
import { DesktopOutlined, PieChartOutlined } from "@ant-design/icons";

import ScreenSizeDetector from "screen-size-detector";

const { Header, Content, Sider } = Layout;

function App() {
  const [api, setApi] = useState();
  const [apiRx, setApiRx] = useState();
  const [chainName, setChainName] = useState("");
  const [blockNum, setBlockNum] = useState("");

  const screen = new ScreenSizeDetector();
  const history = useHistory();

  useEffect(() => {
    const createAPI = async () => {
      const api = await Api.create({
        provider: "wss://cennznet.unfrastructure.io/public/ws",
      });
      setApi(api);
    };
    const createAPIRx = async () => {
      const apiRx = await ApiRx.create({
        provider: "wss://cennznet.unfrastructure.io/public/ws",
      });
      const apiRxProm = await apiRx.toPromise();
      setApiRx(apiRxProm);
    };
    createAPI();
    createAPIRx();
  }, []);

  useEffect(() => {
    if (apiRx) {
      apiRx.rpc.chain.subscribeNewHeads().subscribe((header) => {
        setBlockNum(header.number.toString());
      });
    }
  }, [apiRx]);

  useEffect(() => {
    const getChainName = async (api) => {
      const systemChain = (await api.rpc.system.chain()).toString();
      setChainName(systemChain);
    };
    if (api) getChainName(api);
  }, [api]);

  // TODO: Extract more information
  // useEffect(() => {
  //   if (apiRx) {
  //     const apiResponse = apiRx.rpc.nft.getCollectionInfo([
  //       { name: "55", type: "55" },
  //     ]);
  //     console.log("apiResponse", apiResponse);
  //   }
  // }, [apiRx]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsed={screen.is.mobile}>
        <Menu
          onClick={({ key }) => {
            // TODO: Fix history push with url - extract out Routing/Routes
            if (key === "1") {
              // history.push("/page1");
            }
            if (key === "2") {
              // history.push("/page2");
            }
          }}
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
        >
          <Menu.Item key="1" icon={<PieChartOutlined />}>
            Page 1
          </Menu.Item>
          <Menu.Item key="2" icon={<DesktopOutlined />}>
            Page 2
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }} />
        <Content style={{ margin: "16px 16px" }}>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360 }}
          >
            <p>Welcome to the Cennznet App.</p>
            <p>{chainName ? `Connected to: ${chainName}` : null}</p>
            <p>{blockNum ? `Current Block Number is: ${blockNum}` : null}</p>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
