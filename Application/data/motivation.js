import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import quotes from './motivationalQuotes.json'; // Assuming the JSON file is in the same directory

const MotivationQuotes = () => {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  console.log(randomQuote);
  return (
    <View style={styles.motivationalQuoteContainer}>
        <Text style={styles.motivationalQuote}>{`"${randomQuote.text}"`}</Text>
        <Text style={styles.author}>{`- ${randomQuote.author}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
    motivationalQuoteContainer: {
        flex: 1,
        justifyContent: 'center',
        //borderColor: 'black',
        //borderWidth: 5
      },
      motivationalQuote: {
        fontSize: 50,
        fontFamily: 'Helvetica',
        fontStyle: 'italic',
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 10
      },
      author:{
        fontSize: 25,
        fontFamily: 'helvetica',
        fontStyle: 'italic',
        textAlign: 'right',
        padding: 10
      }
});

export default MotivationQuotes;