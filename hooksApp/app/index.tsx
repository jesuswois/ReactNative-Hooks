import { Button, FlatList, StatusBar, StyleSheet, Text, View } from 'react-native'
import React, { useReducer } from 'react'

const index = () => {
    let currentId = 4
    /// REDUCER
    function reducer(state, action) {
        switch (action.type) {
            case 'added': {
                return [
                    ...state,
                    {
                        id: action.id,
                        text: action.text,
                        done: false
                    }
                ]
            }
            case 'deleted': {
                return state.filter(task => task.id != action.id)
            }
            case 'updated': {
                return state.map(task => task.id === action.task.id ? action.task : task)
            }
        }
    }
    /// INITIAL STATE
    const initialState = [
        {
            id: 1,
            text: "Terminar la tarea",
            done: false
        },
        {
            id: 2,
            text: "Sacar a pasear a Laia",
            done: true
        },
        {
            id: 3,
            text: "Estudiar",
            done: false
        }
    ]
    /// UseReducer
    const [state, dispatch] = useReducer(reducer, initialState)
    /// EVENT HANDLERS
    function handleAddTask(text: string) {
        try {
            dispatch({
                type: 'added',
                id: currentId++,
                text: text
            });
        } catch (err) {
            console.log(err)
        }
    }
    function handleUpdateTask(task: any) {
        dispatch({
            type: 'updated',
            task
        })
    }
    function handleDeleteTask(id: number) {
        console.log("hi")
        dispatch({
            type: 'deleted',
            id
        })
        console.log("bye")
    }
    return (
        <View style={styles.container}>
            <StatusBar translucent={true} barStyle="light-content" />
            <Text style={{ fontSize: 25 }}>-UseReducer-</Text>
            <Text style={styles.title}>Tasks</Text>
            <FlatList
                data={state}
                contentContainerStyle={{ width: "100%", justifyContent: "space-around" }}
                renderItem={({ item }) => {
                    return (
                        <View style={{ width: 100, padding: 5, height: 100, display: "flex", backgroundColor: "#FAFAFA" }}>
                            <Text style={{ textOverflow: "ellipsis" }}>{item.text}</Text>
                            <Button title='Delete' onPress={() => handleDeleteTask(item.id)} />
                        </View>
                    )
                }}
                horizontal
                keyExtractor={item => item.id}
            />
        </View>
    )
}

export default index

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: "center",
        backgroundColor: "#eee"
    },
    title: {
        fontSize: 40,
        fontWeight: "bold"
    },
    text: {
        fontSize: 20
    }
})