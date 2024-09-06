import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal } from 'react-native';
import { Entypo, MaterialIcons, FontAwesome } from '@expo/vector-icons';

const App = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isResultUsed, setIsResultUsed] = useState(false);

  const handlePress = (value) => {
    // Kiểm tra nếu kết quả cũ được dùng và nút "C" được nhấn, reset toàn bộ
    if (isResultUsed && value === 'C') {
      setInput('');
      setResult('');
      setIsResultUsed(false);
      return;
    }

    // Nếu kết quả được dùng và người dùng nhấn một số mới
    if (isResultUsed && !isNaN(value)) {
      setInput(value);
      setIsResultUsed(false);
    } 
    // Nếu kết quả được dùng và người dùng nhấn một toán tử
    else if (isResultUsed && isNaN(value)) {
      setInput(result + value);
      setIsResultUsed(false);
    } 
    // Xử lý các trường hợp khác
    else {
      switch (value) {
        case '=':
          try {
            const finalInput = input.replace(/%/g, '*0.01'); // Thay thế dấu % thành *0.01
            const calculatedResult = eval(finalInput).toString();
            setResult(calculatedResult);
            setHistory([...history, `${input} = ${calculatedResult}`]);
            setInput('');
            setIsResultUsed(true);
          } catch (error) {
            setResult('Lỗi phép tính');
          }
          break;
        case 'C':
          setInput('');
          setResult('');
          break;
        case 'DEL':
          setInput(input.slice(0, -1));
          break;
        case '%':
          setInput(input + '%');
          break;
        default:
          setInput(input + value);
      }
    }
  };

  // Xóa lịch sử tính toán
  const clearHistory = () => {
    setHistory([]);
  };

  const Button = ({ text, onPress, styleOverride = {} }) => (
    <TouchableOpacity onPress={() => onPress(text)} style={[styles.button, styleOverride]}>
      <Text style={[styles.buttonText, styleOverride.text]}>{text}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.container, darkMode ? styles.darkContainer : styles.lightContainer]}
    >
      {/* Menu Button */}
      <TouchableOpacity
        onPress={() => setShowMenu(true)} 
        style={styles.menuButton}
      >
        <Entypo name="menu" size={30} color={darkMode ? "#fff" : "#000"} />
      </TouchableOpacity>

      {/* Hiển thị cho đầu vào và kết quả */}
      <View style={styles.display}>
        <Text style={[styles.inputText, darkMode ? styles.darkText : styles.lightText]}>
          {input || '0'}
        </Text>
        <Text style={[styles.resultText, darkMode ? styles.darkText : styles.lightText]}>
          {result}
        </Text>
      </View>

      {/* Menu Modal */}
      <Modal
        visible={showMenu}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowMenu(false)}
      >
        <View style={styles.menuContainer}>
          {/* menu nằm ngang */}
          <View style={styles.horizontalMenu}>
            <TouchableOpacity
              onPress={() => setDarkMode(!darkMode)} 
              style={styles.menuItem}
            >
              {darkMode ? (
                <MaterialIcons name="brightness-5" size={30} color="#fff" /> // Light 
              ) : (
                <MaterialIcons name="brightness-3" size={30} color="#000" /> // Dark 
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowHistory(!showHistory)} 
              style={styles.menuItem}
            >
              <FontAwesome name="history" size={30} color={darkMode ? "#fff" : "#000"} />
            </TouchableOpacity>

            {/* Nút xóa lịch sử */}
            <TouchableOpacity
              onPress={clearHistory} 
              style={styles.menuItem}
            >
              <FontAwesome name="trash" size={30} color={darkMode ? "#fff" : "#000"} />
            </TouchableOpacity>

            {/* Close Menu Button */}
            <TouchableOpacity
              onPress={() => setShowMenu(false)} 
              style={styles.menuCloseButton}
            >
              <Entypo name="cross" size={30} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Show History */}
          {showHistory && (
            <ScrollView style={styles.historyContainer}>
              {history.length === 0 ? (
                <Text style={[styles.historyText, darkMode ? styles.darkText : styles.lightText]}>
                  Không có lịch sử nào có sẵn.
                </Text>
              ) : (
                history.map((item, index) => (
                  <Text key={index} style={styles.historyItem}>
                    {item}
                  </Text>
                ))
              )}
            </ScrollView>
          )}
        </View>
      </Modal>

      {/* Calculator Buttons */}
      <View style={styles.buttonContainer}>
        {['C', 'DEL', '%', '/'].map((item) => (
          <Button
            key={item}
            text={item}
            onPress={handlePress}
            styleOverride={{
              width: '22%',
              padding: 10,
              text: { fontSize: 18 },
            }}
          />
        ))}
        {['7', '8', '9', '*'].map((item) => (
          <Button key={item} text={item} onPress={handlePress} />
        ))}
        {['4', '5', '6', '-'].map((item) => (
          <Button key={item} text={item} onPress={handlePress} />
        ))}
        {['1', '2', '3', '+'].map((item) => (
          <Button key={item} text={item} onPress={handlePress} />
        ))}
        {['.', '0', '00', '='].map((item) => (
          <Button key={item} text={item} onPress={handlePress} />
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  lightContainer: {
    backgroundColor: '#f0f0f0',
  },
  darkContainer: {
    backgroundColor: '#333',
  },
  menuButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  display: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  inputText: {
    fontSize: 36,
  },
  resultText: {
    fontSize: 28,
    marginTop: 10,
  },
  lightText: {
    color: '#000',
  },
  darkText: {
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  button: {
    width: '22%',
    padding: 15, 
    margin: '1%',
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 20,
    color: '#000',
  },
  menuContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  horizontalMenu: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 20,
  },
  menuItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemText: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    marginTop: 5,
  },
  historyContainer: {
    maxHeight: 150,
    marginBottom: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
  },
  historyItem: {
    fontSize: 18,
    marginVertical: 2,
    textAlign: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
  },
  menuCloseButton: {
    backgroundColor: '#ff0000',
    padding: 10,
    borderRadius: 10,
    alignSelf: 'center',
  },
});

export default App;
