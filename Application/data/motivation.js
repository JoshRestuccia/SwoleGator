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
        backgroundColor: 'red',
        borderRadius: 10,
        padding: 25
        //borderColor: 'black',
        //borderWidth: 5
      },
      motivationalQuote: {
        fontSize: 25,
        fontStyle: 'italic',
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 10,
        color: 'white',
        fontFamily: 'Oswald-Regular'
      },
      author:{
        fontSize: 18,
        fontFamily: 'helvetica',
        fontStyle: 'italic',
        textAlign: 'right',
        padding: 10,
        color: 'white',
        fontFamily: 'Oswald-Regular'
      }
});

export default MotivationQuotes;