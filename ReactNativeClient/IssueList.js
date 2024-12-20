import React, {useState} from 'react';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    Button,
    useColorScheme,
    View,
  } from 'react-native';

  const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

  function jsonDateReviver(key, value) {
    if (dateRegex.test(value)) return new Date(value);
    return value;
  }

  async function graphQLFetch(query, variables = {}) {
    try {
        /****** Q4: Start Coding here. State the correct IP/port******/
        const response = await fetch('http://10.0.2.2:3000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ query, variables })
        /****** Q4: Code Ends here******/
      });
      const body = await response.text();
      const result = JSON.parse(body, jsonDateReviver);
  
      if (result.errors) {
        const error = result.errors[0];
        if (error.extensions.code == 'BAD_USER_INPUT') {
          const details = error.extensions.exception.errors.join('\n ');
          alert(`${error.message}:\n ${details}`);
        } else {
          alert(`${error.extensions.code}: ${error.message}`);
        }
      }
      return result.data;
    } catch (e) {
      alert(`Error in sending data to server: ${e.message}`);
    }
  }

class IssueFilter extends React.Component {
    render() {
      return (
        <>
        {/****** Q1: Start Coding here. ******/}
        <View style={styles.filterContainer}>
          <Text style={styles.filterText}>Issue Filter Placeholder</Text>
        </View>
        {/****** Q1: Code ends here ******/}
        </>
      );
    }
}

// const styles = StyleSheet.create({
//     container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
//   header: { height: 50, backgroundColor: '#537791' },
//   text: { textAlign: 'center' },
//   dataWrapper: { marginTop: -1 },
//   row: { height: 40, backgroundColor: '#E7E6E1' }
//   });
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  header: { flexDirection: 'row', height: 50, backgroundColor: '#537791' },
  headerCell: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    borderWidth: 1,
    borderColor: '#fff',
    padding: 5,
  },
  row: { flexDirection: 'row', height: 40, backgroundColor: '#E7E6E1' },
  cell: {
    flex: 1,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    padding: 5,
  },
  dataWrapper: { marginTop: -1 },
  filterContainer: { padding: 10, backgroundColor: '#f0f0f0' },
  filterText: { fontSize: 16, fontWeight: 'bold' },
  input: {
    height: 40,
    borderColor: '#cccccc',
    borderWidth: 1,
    paddingLeft: 8,
    marginBottom: 10,
    borderRadius: 4,
  },
  text: { textAlign: 'center', padding: 5 },
});


const width= [40,80,80,80,80,80,200];

function IssueRow(props) {
    const issue = props.issue;
    {/****** Q2: Coding Starts here. Create a row of data in a variable******/}
    const data = [
      issue.id.toString(),
      issue.title,
      issue.status,
      issue.owner,
      issue.created.toDateString(),
      issue.effort ? issue.effort.toString() : '',
      issue.due ? issue.due.toDateString() : '',
    ];
    {/****** Q2: Coding Ends here.******/}
    return (
      <>
      {/****** Q2: Start Coding here. Add Logic to render a row  ******/}
      <View style={styles.row}>
        {data.map((cellData, index) => (
          <Text style={styles.text} key={index}>
            {cellData}
          </Text>
        ))}
      </View>
      {/****** Q2: Coding Ends here. ******/}  
      </>
    );
  }
  
  
  function IssueTable(props) {
    const issueRows = props.issues.map(issue =>
      <IssueRow key={issue.id} issue={issue} />
    );

    {/****** Q2: Start Coding here. Add Logic to initalize table header  ******/}
    const tableHeader = ['ID', 'Title', 'Status', 'Owner', 'Created', 'Effort', 'Due'];
    {/****** Q2: Coding Ends here. ******/}
    
    
    return (
    <View style={styles.container}>
    {/****** Q2: Start Coding here to render the table header/rows.**********/}
    <View style={styles.header}>
        {tableHeader.map((headerItem, index) => (
          <Text style={styles.headerCell} key={index}>
            {headerItem}
          </Text>
        ))}
      </View>
      <ScrollView style={styles.dataWrapper}>
        {issueRows}
      </ScrollView>
    {/****** Q2: Coding Ends here. ******/}
    </View>
    );
  }

  
  class IssueAdd extends React.Component {
    constructor() {
      super();
      this.handleSubmit = this.handleSubmit.bind(this);
      /****** Q3: Start Coding here. Create State to hold inputs******/
      this.state = {
        title: '',
        owner: '',
        effort: '',
      };
      /****** Q3: Code Ends here. ******/
    }
  
    /****** Q3: Start Coding here. Add functions to hold/set state input based on changes in TextInput******/
    handleTitleChange = (text) => {
      this.setState({ title: text });
    };
  
    handleOwnerChange = (text) => {
      this.setState({ owner: text });
    };

    handleEffortChange = (text) => {
      this.setState({ effort: text });
    };
    /****** Q3: Code Ends here. ******/
    
    handleSubmit() {
      /****** Q3: Start Coding here. Create an issue from state variables and call createIssue. Also, clear input field in front-end******/
      const issue = {
        title: this.state.title,
        owner: this.state.owner,
        effort: parseInt(this.state.effort),
        due: new Date(),
      };
      this.props.createIssue(issue);
      this.setState({ title: '', owner: '', effort: '' });
      /****** Q3: Code Ends here. ******/
    }
  
    render() {
      return (
          <View>
          {/****** Q3: Start Coding here. Create TextInput field, populate state variables. Create a submit button, and on submit, trigger handleSubmit.*******/}
          <TextInput
          placeholder="Title"
          value={this.state.title}
          onChangeText={this.handleTitleChange}
          style={styles.input}
          />
          <TextInput
            placeholder="Owner"
            value={this.state.owner}
            onChangeText={this.handleOwnerChange}
            style={styles.input}
          />
          <TextInput
            placeholder="Effort"
            value={this.state.effort}
            onChangeText={this.handleEffortChange}
            keyboardType="numeric"
            style={styles.input}
          />
          <Button title="Add Issue" onPress={this.handleSubmit} />
          {/****** Q3: Code Ends here. ******/}
          </View>
      );
    }
  }

class BlackList extends React.Component {
    constructor()
    {   super();
        this.handleSubmit = this.handleSubmit.bind(this);
        /****** Q4: Start Coding here. Create State to hold inputs******/
        this.state = {name: ''};
        /****** Q4: Code Ends here. ******/
    }
    /****** Q4: Start Coding here. Add functions to hold/set state input based on changes in TextInput******/
    setName(newname) {
        this.setState({name: newname});
    }
    /****** Q4: Code Ends here. ******/

    async handleSubmit() {
    /****** Q4: Start Coding here. Create an issue from state variables and issue a query. Also, clear input field in front-end******/
    /****** Q4: Code Ends here. ******/
    const query = `mutation myaddtoBlacklist($newname: String!) {
     addToBlacklist(nameInput: $newname)
    }`;
    const newname = this.state.newname;
    const data = await graphQLFetch(query, { newname });
    this,newnameInput.clear();
    }

    render() {
    return (
        <View>
        {/****** Q4: Start Coding here. Create TextInput field, populate state variables. Create a submit button, and on submit, trigger handleSubmit.*******/}
        <TextInput
          ref={input => { this.newnameInput = input; }}
          placeholder="Enter Name"
          value={this.state.newname}
          onChangeText={this.setName}
          style={styles.input}
        />
        <Button onPress={this.handleSubmit} title="Add to Blacklist" />
        {/****** Q4: Code Ends here. ******/}
        </View>
    );
    }
}

export default class IssueList extends React.Component {
    constructor() {
        super();
        this.state = { issues: [] };
        this.createIssue = this.createIssue.bind(this);
    }
    
    componentDidMount() {
    this.loadData();
    }

    async loadData() {
    const query = `query {
        issueList {
        id title status owner
        created effort due
        }
    }`;

    const data = await graphQLFetch(query);
    if (data) {
        this.setState({ issues: data.issueList });
    }
    }

    async createIssue(issue) {
    const query = `mutation issueAdd($issue: IssueInputs!) {
        issueAdd(issue: $issue) {
        id
        }
    }`;

    const data = await graphQLFetch(query, { issue });
    if (data) {
        this.loadData();
    }
    }
    
    
    render() {
    return (
    <>
    {/****** Q1: Start Coding here. ******/}
    <IssueFilter />
    {/****** Q1: Code ends here ******/}


    {/****** Q2: Start Coding here. ******/}
    <IssueTable issues={this.state.issues} />
    {/****** Q2: Code ends here ******/}

    
    {/****** Q3: Start Coding here. ******/}
    <IssueAdd createIssue={this.createIssue} />
    {/****** Q3: Code Ends here. ******/}

    {/****** Q4: Start Coding here. ******/}
    <BlackList />
    {/****** Q4: Code Ends here. ******/}
    </>
      
    );
  }
}
