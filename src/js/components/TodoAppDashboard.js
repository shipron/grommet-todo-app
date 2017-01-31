import React, { Component } from 'react';
import Box from 'grommet/components/Box';
import Button from 'grommet/components/Button';
import Heading from 'grommet/components/Heading';
import Footer from 'grommet/components/Footer';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';
import Meter from 'grommet/components/Meter';
import Value from 'grommet/components/Value';
import Status from 'grommet/components/icons/Status';
import CloseIcon from 'grommet/components/icons/base/Close';
import TodoAddTaskForm from './TodoAddTaskForm';

import { browserHistory } from 'react-router';
import { getTasks } from '../store';


function getLabel(label, count, colorIndex) {
  return {
    "label": label,
    "value": count,
    "colorIndex": colorIndex
  };
}

export default class TodoAppDashboard extends Component {

  constructor () {
    super();
    this._onRequestForAddTask = this._onRequestForAddTask.bind(this);
    this.state = {
      tasks: [ ]
    };
  }

  componentDidMount () {
    getTasks().then((tasks)=>this.setState({tasks: tasks}));

  }

  _onRequestForAddTask (event) {
    event.preventDefault();
    browserHistory.push('/add');

  }

  _onDeleteTask (taskIndex) {
    let tasks = this.state.tasks;
    tasks.splice(taskIndex, 1);
    this.setState (tasks);
  }

  render () {

    let tasksMap = {
      critical: 0,
      ok: 0,
      warning: 0
    };

    let tasks = this.state.tasks.map((task, index) => {

      tasksMap[task.status] += 1;

      let separator;
      if (index === 0) {
        separator = 'horizontal';
      }
      return (
        <ListItem key={`task_${index}`} separator={separator}
          responsive={false}>
          <Box>
            <Status value={task.status} size='small' />
          </Box>
          <Box pad="medium">
            <span>{task.label}</span>
          </Box>
          <Button onClick={this._onDeleteTask.bind(this, index)}>
            <CloseIcon />
          </Button>
        </ListItem>

      );
    }, this);

    const series = [
      getLabel('Past Due', tasksMap.critical, 'critical'),
      getLabel('Due Soon', tasksMap.warning, 'warning'),
      getLabel('Done', tasksMap.ok, 'ok')
    ];

    let value, label;
    if (this.state.index >= 0) {
      value = series[this.state.index].value;
      label = series[this.state.index].label;
    } else {
      value = 0;
      series.forEach(serie => value += serie.value);
      label = 'Total';
    }

    return (
      <Box primary={true} flex={true} direction='row'>
        <Box basis='1/3' align="center">
          <Meter series={series} type="circle" label={false}
            onActive={(index) => this.setState({ index: index })} />
          <Box direction="row" justify="between" align="center"
            responsive={false}>
            <Value value={value} units="Tasks" align="center" label={label} />
          </Box>
        </Box>
        <Box basis='2/3' pad='medium'>
          <Heading tag='h3'>My Tasks</Heading>
          <List>
            {tasks}
          </List>
          <Footer>
            <Button href='/add' label="Add Task" onClick={this._onRequestForAddTask}
            primary={true}/>
          </Footer>
        </Box>
      </Box>
    );
  }
};
