import { Alert, Button, Dimensions, FlatList, Modal, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useReducer, useRef, useState } from 'react'
import { Checkbox } from 'expo-checkbox'

const index = () => {
    // Inputs
    const [text, setText] = useState("") // Almacenar Input de Título de tarea
    const [status, setStatus] = useState(false)
    // Modal
    const [modal, setModal] = useState(false) // Switch para mostrar modal
    const [isEditing, setIsEditing] = useState(false) // Alternar modal entre interfaz de Editar y Crear
    const currentTask = useRef(0) // Id de Tarea seleccionada (Si se esta editando)
    const [currentId, setCurrentId] = useState(4)
    // Reducer (Lista de Tasks)
    /*
    Conceptos
        -Reducer (reductor): Se refiere a una función pura, la cual toma el estado actual
            del estado y la acción

        -Dispatch (despacha acciones): Se refiere a la función proporcionada por useReducer,
            la cual permite hacer llamadas, la cual seria manejada por el reducer.
            Al usar dispatch, se debe mandar un objeto (acción) con las propiedades: 
            -type: Tipo de acción.
            -...acciones: Describe de la manera mas concreta lo ocurrido.
        
        -Initial State: Hace referencia al estado inicial (en este caso, el estado 
            de las tareas).

        -Event Handlers: Son los que manejan los eventos (un click del usuario).
    
    BONUS: Pure Function: Una función pura es aquella que no manipula en lo absoluto algo
        fuera de su Scope. Es aquella que "minds his own business". Como pilar tiene el
        siguiente principio: Mismas entradas, mismas salidas. 
        
        Un buen comienzo para un proyecto en React, es que se procure mantener puras las
        funciones (callbacks) de las pantallas (componentes).
    */
    /// REDUCER
    function reducer(state, action) {
        switch (action.type) {
            case 'added': {
                console.log(action)
                return [
                    ...state,
                    {
                        id: action.id,
                        text: action.task.text,
                        done: action.task.done
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
    function handleAddTask(task: any) {
        setCurrentId(currentId + 1)
        try {
            dispatch({
                type: 'added',
                id: currentId,
                task
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
        Alert.alert("Confirmación", "Estas por eliminar una tarea. Una vez eliminada no se podra recuperar.",
            [
                {
                    text: "Continuar",
                    onPress: () => {
                        dispatch(
                            {
                                type: 'deleted',
                                id
                            })
                    },
                    style: "destructive"
                },
                {
                    text: "Cancelar",
                    onPress: () => null,
                    style: "cancel"
                }])
    }
    // Form Handlers
    const handleUpdate = () => {
        const validation = validate()
        if (validation.status) {
            handleUpdateTask({ id: currentTask.current, text, done: status })
            setModal(false)
            Alert.alert("Tarea actualizada!")
        } else {
            Alert.alert("Error", validation.message)
        }
    }
    const handleAdd = () => {
        const validation = validate()
        if (validation.status) {
            handleAddTask({ text, done: status })
            setModal(false)
            Alert.alert("Tarea creada!")
        } else {
            Alert.alert("Error",validation.message)
        }
    }
    // Form Validator
    const validate = () => {
        if (text.trim().length > 0) {
            console.log(/^\w+((( )\w+)+)?$/.test(text))
            if (/^\w+$/.test(text))
                return { status: true }
            else
                return { status: false, message: "Las tareas solo pueden contener letras o números!" }
        }
        return { status: false, message: "Las tareas deben llevar un título!" }
    }
    return (
        <View style={styles.container}>
            <StatusBar translucent={true} barStyle="light-content" />
            <Text style={{ fontSize: 25 }}>-UseReducer-</Text>
            <Text style={styles.title}>Tasks</Text>
            <FlatList
                data={state}
                contentContainerStyle={{ rowGap: 20 }}
                renderItem={({ item }) => {
                    return (
                        <View style={{ width: Dimensions.get("screen").width - 40, borderRadius: 10, height: "auto", padding: 10, backgroundColor: "#FAFAFA", rowGap: 20 }}>
                            <Text style={{ textAlign: "center", fontSize: 30 }}>{item.text}</Text>
                            <View style={{ flexDirection: "row", alignSelf: "center" }}>
                                <Text>Status: </Text>
                                <Checkbox disabled value={item.done} />
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                                <TouchableOpacity style={{ padding: 20, borderRadius: 10, backgroundColor: "#9999FF" }} onPress={() => { setModal(!modal); setIsEditing(true); setText(item.text); setStatus(item.done); currentTask.current = item.id }}>
                                    <Text style={{ width: 50, textAlign: "center" }}>Editar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ padding: 20, borderRadius: 10, backgroundColor: "#FF9999" }} onPress={() => handleDeleteTask(item.id)}>
                                    <Text style={{ width: 50, textAlign: "center" }}>Borrar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                }}
                keyExtractor={item => item.id}
            />
            <Modal
                animationType="fade"
                backdropColor={"#blue"}
                transparent={true}
                visible={modal}
                onRequestClose={() => setModal(!modal)}
            >
                <View style={{ flex: 1 }}>
                    <TouchableOpacity delayPressIn={10000} onPress={() => setModal(!modal)} style={{ position: 'absolute', backgroundColor: "black", height: "100%", width: "100%", opacity: 0.5 }}>
                    </TouchableOpacity>
                    <View style={{ elevation: 5, rowGap: 20, backgroundColor: "white", flex: 1, marginTop: "80%", padding: 20, alignItems: "center" }}>
                        <Text style={{ fontSize: 35 }}>{isEditing ? "Editando tarea" : "Creando tarea"}</Text>
                        <Text>Título</Text>
                        <TextInput style={{ width: "100%", backgroundColor: "#eee" }} value={text} onChangeText={setText} />
                        <Text>Estatus</Text>
                        <Checkbox value={status} onValueChange={setStatus} />
                        <TouchableOpacity onPress={isEditing ? handleUpdate : handleAdd} style={{ backgroundColor: "#AAFFAA", padding: 20, borderRadius: 10 }}>
                            <Text>{isEditing ? "Guardar" : "Crear"}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <TouchableOpacity onPress={() => { setIsEditing(false); setModal(!modal) }} style={{ backgroundColor: "#95FF95", padding: 20, width: "100%", borderRadius: 10 }}>
                <Text style={{ textAlign: "center" }}>Nueva tarea</Text>
            </TouchableOpacity>
        </View>
    )
}

export default index

const styles = StyleSheet.create({
    container: {
        flex: 1,
        rowGap: 20,
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