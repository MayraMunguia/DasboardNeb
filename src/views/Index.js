/*!

=========================================================
* Argon Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
// node.js library that concatenates classes (strings)
import classnames from "classnames";
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
import { Line } from "react-chartjs-2";
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Alert
} from "reactstrap";

// core components
import {
  chartOptions,
  parseOptions,
} from "variables/charts.js";

import Header from "components/Headers/Header.js";

import trae from "trae";

class Index extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      outliers: [],
      AireChartData: {},
      SoilChartData: {},
      TempChartData: {},
      Agua : true,
    };
    if (window.Chart) {
      parseOptions(Chart, chartOptions());
    }
    this.getData = this.getData.bind(this);
  }

  getData = () => {
    console.log("Getting chart data...");
    fetch("http://192.168.100.24:1108/api/GetReadings/", {method: 'POST'})
    .then(res => res.json())
    .then(res => {
      console.log(res)

      let readingsAire = res.aire.map(i => i.toString())
      let dataAire = {
        labels: [...Array(readingsAire.length).keys()].map(i => i.toString()),
        datasets: [
          {
            type: 'line',
            label: 'readings',
            borderColor: 'rgb(22, 224, 189)',
            borderWidth: 2,
            fill: false,
            data: readingsAire,
          }
        ]
      };

      let readingsSoil = res.soil.map(i => i.toString())
      let dataSoil = {
        labels: [...Array(readingsSoil.length).keys()].map(i => i.toString()),
        datasets: [
          {
            type: 'line',
            label: 'readings',
            borderColor: 'rgb(22, 224, 189)',
            borderWidth: 2,
            fill: false,
            data: readingsSoil,
          }
        ]
      };

      let readingstemp = res.temp.map(i => i.toString())
      let datatemp = {
        labels: [...Array(readingstemp.length).keys()].map(i => i.toString()),
        datasets: [
          {
            type: 'line',
            label: 'readings',
            borderColor: 'rgb(22, 224, 189)',
            borderWidth: 2,
            fill: false,
            data: readingstemp,
          }
        ]
      };
      let deposito = res.agua
      console.log(deposito)

      this.setState({AireChartData: dataAire,SoilChartData: dataSoil, TempChartData: datatemp, Agua : deposito});
    })
    .catch(err => console.error(err));
  }

  componentDidMount() {
    // CONFIGURE API REST HERE
    //this.getData("http://192.168.100.24:1108/api/GetReadings/")
    this.getData();


    setInterval(this.getData, 5000);
  }

  render() {
      const OutlierList = (props) => { 
        return (
          <Alert color="danger">
            <span>% de agua menor al limite permitido.</span>
        
          </Alert>
          )
        }
    return (
      <>
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>
        {this.state.Agua &&
        
          <OutlierList outliers={this.state.Agua}/>
        }
          <Row>
            <Col className="mb-2" xl="6">
              <Card className="bg-gradient-default shadow">
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <h3 className="text-uppercase text-light ls-1 mb-1">
                        % Humedad del aire
                      </h3>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  {/* Chart */}
                  <div className="chart">
                    <Line data={this.state.AireChartData}/>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col className="mb-5" xl="6">
              <Card className="bg-gradient-default shadow">
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <h3 className="text-uppercase text-light ls-1 mb-1">
                        % Humedad del suelo
                      </h3>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  {/* Chart */}
                  <div className="chart">
                    <Line data={this.state.SoilChartData}/>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col className="mb-5" xl="12">
              <Card className="bg-gradient-default shadow">
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <h3 className="text-uppercase text-light ls-1 mb-1">
                        Temperatura
                      </h3>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  {/* Chart */}
                  <div className="chart">
                    <Line data={this.state.TempChartData}/>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>

      </>
    );
  }
}

export default Index;
