import { Grid, Typography } from '@mui/material';
import React from 'react';
import stringSimilarity from 'string-similarity';

const cleanWord = word =>
  word
    .trim()
    .toLocaleLowerCase()
    .replace(/[^a-z]/gi, '')

const Teleprompter = ({
  words,
  progress,
  listening,
  onChange
}) => {
  const recog = React.useRef(null)
  const scrollRef = React.useRef(
    null
  )
  const [
    results,
    setResults
  ] = React.useState('')

  React.useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition
    recog.current = new SpeechRecognition()
    recog.current.continuous = true
    recog.current.interimResults = true
  }, [])

  React.useEffect(() => {
    if (listening) {
      recog.current.start()
    } else {
      recog.current.stop()
    }
  }, [listening])

  React.useEffect(() => {
    const handleResult = ({
      results
    }) => {
      const interim = Array.from(
        results
      )
        .filter(r => !r.isFinal)
        .map(r => r[0].transcript)
        .join(' ')
      setResults(interim)

      const newIndex = interim
        .split(' ')
        .reduce((memo, word) => {
          if (
            memo >= words.length
          ) {
            return memo
          }
          const similarity = stringSimilarity.compareTwoStrings(
            cleanWord(word),
            cleanWord(words[memo])
          )
          memo +=
            similarity > 0.75
              ? 1
              : 0
          return memo
        }, progress)
      if (
        newIndex > progress &&
        newIndex <= words.length
      ) {
        onChange(newIndex)
      }
    }
    recog.current.addEventListener(
      'result',
      handleResult
    )
    return () => {
      recog.current.removeEventListener(
        'result',
        handleResult
      )
    }
  }, [onChange, progress, words])

  React.useEffect(() => {
    /* eslint-disable no-unused-expressions */
    scrollRef.current
      .querySelector(
        `[data-index='${
          progress + 3
        }']`
      )
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start'
      })
  }, [progress])
  
  return (
    <Grid container flexDirection="row" item md={12} lg={12} xl={12} >
      <Grid ref={scrollRef}
        container item md={12} lg={12} xl={12} sx={{
        borderColor: 'black',
        border: '1px solid black',
        overflow: 'scroll',
        maxHeight: 400
      }}>
        {words.map((word, index) => (
          <Typography
            key={index}
            data-index={index}
            color={index < progress
              ? '#ccc'
              : '#000'}
            marginRight={1}
            variant="h1"
          >
            {word}
          </Typography>
        ))}
      </Grid>
      {results && (
        <Grid container item md={12} lg={12} xl={12}>
          <Typography
            color='black'
            variant="body1"
          >
            {results}
          </Typography>
        </Grid>
      )}
    </Grid>
  )
}

export default Teleprompter