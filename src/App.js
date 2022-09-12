import './App.css';
import {Grid, Button, TextField} from '@mui/material';
import React from 'react';
import Teleprompter from './Teleprompter';

const INITIAL_TEXT = `In writing, the words point and purpose are almost synonymous. Your point is your purpose, and how you decide to make your point clear to your reader is also your purpose. Writers have a point and a purpose for every paragraph that they create.

Writers write descriptive paragraphs because their purpose is to describe something. Their point is that something is beautiful or disgusting or strangely intriguing. Writers write persuasive and argument paragraphs because their purpose is to persuade or convince someone. Their point is that their reader should see things a particular way and possibly take action on that new way of seeing things. Writers write paragraphs of comparison because the comparison will make their point clear to their readers.`

function App() {
  const [
    listening,
    setListening
  ] = React.useState(false)

  const [
    words,
    setWords
  ] = React.useState(
    INITIAL_TEXT.split(' ')
  )
  
  const [
    progress,
    setProgress
  ] = React.useState(0)

  const handleInput = e => {
    setWords(
      e.target.value.split(' ')
    )
    progress && setProgress(0)
  }

  const handleListening = () => {
    if (listening) {
      setListening(false)
    } else {
      setProgress(0)
      setListening(true)
    }
  }

  const handleReset = () =>
    setProgress(0)

  const handleChange = progress =>
    setProgress(progress)
  
  return (
    <Grid container padding={2} justifyContent="center">
      <Grid item md={6} lg={6} xl={6} backgroundColor='lightGray' marginBottom={2}>
        <TextField fullWidth variant="outlined" multiline onChange={handleInput} value={words.join(' ')} />
      </Grid>
      <Grid container item md={12} lg={12} marginBottom={2} justifyContent="center">
        <Button
          onClick={handleListening}
          variant="contained"
          sx={{ marginRight: 2 }}
          color={listening ? 'warning' : 'primary'}
        >
          {listening ? 'Stop' : 'Start'}
        </Button>
        <Button
          disabled={listening}
          onClick={handleReset}
          variant="outlined"
        >
          Reset
        </Button>
      </Grid>
      <Grid container item md={6} lg={6} padding={2}>
        <Teleprompter
          words={words}
          listening={listening}
          progress={progress}
          onChange={handleChange}
        />
      </Grid>
    </Grid>
  );
}

export default App;
