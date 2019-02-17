import argparse
import configparser
import json
import os
import subprocess
import sys

parser = argparse.ArgumentParser(
    prog='exorun',
    description='Loads an eXo and launches it.')
parser.add_argument('game', help='Name of eXo')

args = parser.parse_args()

with open('settings.json', 'r') as settings_file:
    settings = json.load(settings_file)

game_path = args.game
with open(os.path.join(game_path, 'bootdisk.json'), 'r') as bootdisk_file:
    bootdisk = json.load(bootdisk_file)

print('Loading "{}"...'.format(bootdisk['title']))

requirements = bootdisk['requires']

config = configparser.ConfigParser()
config.read('conf/dosbox.conf')
with open('dosbox-launch.conf', 'w') as launch_config:
    config.write(launch_config)
    #Write an [autoexec] based on the bootdisk.json
    launch_config.write('\n[autoexec]\n')
    if 'hdd' in requirements:
        hdd = requirements['hdd']
        hdd_drive = hdd['drive']
        hdd_path = os.path.join(game_path, 'hdd')
        launch_config.write('MOUNT {} "{}"\n'.format(
            hdd_drive,
            hdd_path))
    if 'media' in requirements:
        # MOUNT media based on type
        for media in requirements['media']:
            media_type = media['type']
            drive = media['drive']
            if media_type == 'image':
                files = ['"{}"'.format(os.path.join(game_path, 'media', f)) for f in media['files']]
                format = media['format']
                launch_config.write('IMGMOUNT {} {} -t {}\n'.format(
                    drive,
                    ' '.join(files),
                    format
                ))
            elif media_type == 'dir':
                path = os.path.join(game_path, 'media', media['path'])
                format = media['format']
                label = media['label']
                launch_config.write('MOUNT {} "{}" -t {} -label {}\n'.format(
                    drive,
                    path,
                    format,
                    label
                ))

    if 'hdd' in requirements:
        launch_config.write('{}:\n'.format(hdd['drive']))

    start = bootdisk['launch']
    if start['path']:
        launch_config.write('CD {}\n'.format(start['path']))
    launch_config.write('{}\n'.format(start['exe']))
    launch_config.write('EXIT\n')

subprocess.run([settings['dosbox']['cmd'], '-noconsole', '-conf', 'dosbox-launch.conf'])
os.remove('dosbox-launch.conf')
