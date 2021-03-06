'use strict';

let { default: Client } = require(`@alicloud/cs20151215`);
let runtime = require('../../../../../runtime.js');
let output = require('../../../../../output.js');

exports.cmdObj = {
    use: 'arc cs cluster update-tag',
    desc: {
        zh: '修改当前Kubernetes集群的tag接口',
        en: `modify the tags of a cluster.`
    },
    options: {
        key: {
            required: true,
            mapping: 'key',
            desc: {
                zh: '标签名称',
                en: `The name of the tag to be modified.`
            }
        },
        value: {
            required: true,
            mapping: 'value',
            desc: {
                zh: '标签值',
                en: `The value of the tag to be modified.`
            }
        }
    },
    args: [
        {
            name: 'clusterId',
            required: true
        }
    ]
};

exports.run = async function (argv) {
    let profile = await runtime.getConfigOption();
    let { Config } = require('@alicloud/openapi-client');
    let config = new Config({
        accessKeyId: profile.access_key_id,
        accessKeySecret: profile.access_key_secret,
        securityToken: profile.sts_token,
        regionId: profile.region,
        type: profile.type
    });
    let ModifyClusterTagsRequest = require(`@alicloud/cs20151215`).ModifyClusterTagsRequest;
    let request = new ModifyClusterTagsRequest(argv._mappingValue);

    let client = new Client(config);
    try {
        await client.modifyClusterTagsWithOptions(argv._[0], request, {}, runtime.getRuntimeOption(argv));
    } catch (e) {
        output.error(e.message);
    }
};