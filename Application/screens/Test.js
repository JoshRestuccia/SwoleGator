import React from 'react'
import {Text, View} from 'react-native'

const Test = ({route}) => {
    return(
        <View>
            <Text>{route.params.msg}</Text>
        </View>
    )
}

export default Test