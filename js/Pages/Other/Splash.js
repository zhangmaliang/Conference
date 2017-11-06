/**
 * Created by zhangmaliang on 2017/7/19.
 */

import React from 'react';
import {Animated} from 'react-native';
import NavigationUtil from '../../Utils/NavigationUtil';
import StorageUtil from '../../Utils/StorageUtil';
import {UserDao} from '../../Storage/User'

export default class Splash extends React.PureComponent {

    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            bounceValue: new Animated.Value(1)
        };
    }

    componentDidMount() {
        Animated.timing(this.state.bounceValue, {
            toValue: 1.2,
            duration: 800
        }).start(this._goNextPage)
    }


    _goNextPage = () => {
        StorageUtil.get('isGuide').then(isGuide => {
            if (isGuide) {
                UserDao.getCurrentUser().then(user => {
                    user ? this._resetToPage('ConferencePage') : this._resetToPage('LoginPage')
                })
            } else {
                this._resetToPage('GuidePage')
            }
        })
    };

    _resetToPage(page) {
        NavigationUtil.reset(this.props.navigation, page)
    }

    render() {
        return (
            <Animated.Image
                source={require('../../../Resources/Images/GuideImages/splash.png')}
                style={{width: SCREEN_WIDTH, height: SCREEN_HEIGHT,
                        transform: [{scale: this.state.bounceValue }]}}/>
        );
    }
}

