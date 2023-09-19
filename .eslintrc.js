module.exports = {
    root: true,
    extends: ['@react-native', 'prettier'],
    rules: {
        'react/no-unstable-nested-components': [
            'off',
            {
                allowAsProps: true,
            },
        ],
    },
};
