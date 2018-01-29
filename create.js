const fs = require('fs');

if (process.argv.length <= 2) {
  process.exit(-1);
}

const type = process.argv[2];
const path = process.argv[3];
const requestedFiles = process.argv[4];
const filesToCreate = requestedFiles.split(',');

filesToCreate.forEach((file) => {
  const fileDir = path === '/' ? `${file}.js` : `${path}/${file}.js`;
  const className = file[0].toUpperCase() + file.slice(1);

  let content = '';

  if (type === 'class') {
    content = `import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({

});

class ${className} extends Component {
  constructor(props){
    super(props);

    this.state = {

    };
  }

  render() {
    return(
    <Text>CommentFooter</Text>
    );
  }
}

${className}.propTypes = {
  style: View.propTypes.style,
};

${className}.defaultProps = {
  style: {},
};

export default ${className};

`;
  }

  if (type === 'dumb') {
    content = `import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({

});

const ${className} = ({ style }) => (
  <View>CommentFooter</View>
)

${className}.propTypes = {
  style: View.propTypes.style,
};

${className}.defaultProps = {
  style: {},
};

export default ${className};

`;
  }

  /* eslint-disable no-console */
  try {
    if (!fs.existsSync(fileDir)) {
      fs.writeFileSync(fileDir, content, 'utf8');
    } else {
      console.log('\x1b[31m', `File ${fileDir} already exists`);
    }
  } catch (err) {
    console.log('\x1b[31m', err);
  }
});

