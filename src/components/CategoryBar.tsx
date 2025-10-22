import * as React from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity } from 'react-native';

// CategoryBar Component
import All from '../assets/categoryIcon/all.svg';
import Animals from '../assets/categoryIcon/animals.svg';
import Cars from '../assets/categoryIcon/cars.svg';
import Cities from '../assets/categoryIcon/cities.svg';
import Dinos from '../assets/categoryIcon/dinos.svg';
import Family from '../assets/categoryIcon/family.svg';
import Foods from '../assets/categoryIcon/foods.svg';
import Jobs from '../assets/categoryIcon/jobs.svg';
import Natural from '../assets/categoryIcon/natural.svg';
import Study from '../assets/categoryIcon/study.svg';

const CategoryBar = () => {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}>
            <TouchableOpacity>  <All/>      </TouchableOpacity>
            <TouchableOpacity>  <Animals/>  </TouchableOpacity>
            <TouchableOpacity>  <Cars/>     </TouchableOpacity>
            <TouchableOpacity>  <Cities/>   </TouchableOpacity>
            <TouchableOpacity>  <Dinos/>    </TouchableOpacity>
            <TouchableOpacity>  <Family/>   </TouchableOpacity>
            <TouchableOpacity>  <Foods/>    </TouchableOpacity>
            <TouchableOpacity>  <Jobs/>     </TouchableOpacity>
            <TouchableOpacity>  <Natural/>  </TouchableOpacity>
            <TouchableOpacity>  <Study/>    </TouchableOpacity>    
      </ScrollView>
    </View>
  );
};

export default CategoryBar;

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 16, 
  },
});
