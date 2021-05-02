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
      chartData: {}
    };
    if (window.Chart) {
      parseOptions(Chart, chartOptions());
    }
    this.getData = this.getData.bind(this);
  }

  getData(apiEndpoint) {
    console.log("Getting chart data...");
    fetch(apiEndpoint, {method: 'POST'})
    .then(res => res.json())
    .then(res => {
      let readings = res.res.map(i => i.toString())
      let data = {
        labels: [...Array(readings.length).keys()].map(i => i.toString()),
        datasets: [
          {
            type: 'line',
            label: 'upper',
            borderColor: 'rgb(239, 39, 27)',
            borderWidth: 2,
            fill: false,
            data: Array(readings.length).fill(res.limSuper),
          },
          {
            type: 'line',
            label: 'lower',
            borderColor: 'rgb(239, 39, 27)',
            borderWidth: 2,
            fill: false,
            data: Array(readings.length).fill(res.limInfer),
          },
          {
            type: 'line',
            label: 'readings',
            borderColor: 'rgb(22, 224, 189)',
            borderWidth: 2,
            fill: false,
            data: readings,
          }
        ]
      };

      let outliers = readings.filter(e => e > res.limSuper || e < res.limInfer);

      this.setState({chartData: data, outliers: outliers});
    })
    .catch(err => console.error(err));
  }

  componentDidMount() {
    // CONFIGURE API REST HERE
    this.getData("http://192.168.100.43:1108/api/GetReadings/")
  }

  render() {
    const OutlierList = (props) => { 
    return (
      <Alert color="danger">
        <span>Se han identificado los siguientes outliers:</span>
        <ul>
          {props.outliers.map(outlier => (
              <li>{outlier.toString()}</li>               
          ))}
        </ul>
      </Alert>
      )
    }
    return (
      <>
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>
        {this.state.outliers.length > 0 &&
        (
          <OutlierList outliers={this.state.outliers}/>
        )}
          <Row>
            <Col className="mb-5 mb-xl-0" xl="12">
              <Card className="bg-gradient-default shadow">
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <h3 className="text-uppercase text-light ls-1 mb-1">
                        % de Luz recibido por jardin
                      </h3>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  {/* Chart */}
                  <div className="chart">
                    <Line data={this.state.chartData}/>
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
