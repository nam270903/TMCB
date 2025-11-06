import * as React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

// Category Icons
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

const categories = [
  { id: 'all', icon: <All /> },
  { id: 'animals', icon: <Animals /> },
  { id: 'cars', icon: <Cars /> },
  { id: 'cities', icon: <Cities /> },
  { id: 'dinos', icon: <Dinos /> },
  { id: 'family', icon: <Family /> },
  { id: 'foods', icon: <Foods /> },
  { id: 'jobs', icon: <Jobs /> },
  { id: 'natural', icon: <Natural /> },
  { id: 'study', icon: <Study /> },
];

interface CategoryBarProps {
  activeFilter: string;
  onSelectCategory: (category: string) => void;
}

const CategoryBar = ({ activeFilter, onSelectCategory }: CategoryBarProps) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {categories.map(cat => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.iconWrapper,
              activeFilter === cat.id && styles.activeIcon,
            ]}
            onPress={() => onSelectCategory(cat.id)}>
            {cat.icon}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default CategoryBar;

const styles = StyleSheet.create({
  wrapper: { 
    width: '100%' 
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  iconWrapper: {
    // opacity: 0.6,
  },
  activeIcon: {
    opacity: 1,
    transform: [{ scale: 1.05 }],
  },
});
