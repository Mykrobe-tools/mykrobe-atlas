## Electron - Predictor binaries

Documented as this almost works but fails - may be a good strategy in future:

1. Install Wine to build Windows app on Mac

	```
	$ brew install wine
	$ brew install winetricks
	```

2. Download and install Python on Wine

	```
	$ curl -O https://www.python.org/ftp/python/2.7.10/python-2.7.10.msi
	$ wine msiexec /i python-2.7.10.msi /L*v log.txt
	```

3. Install PyInstaller on Wine

	```
	$ cd ~/.wine/drive_c/Python27
	$ wine python.exe Scripts/pip.exe install pyinstaller
	```

4. Install git on Wine

	```
	$ # set to Vista
	$ winecfg
	$ curl -OL https://github.com/git-for-windows/git/releases/download/v2.14.2.windows.3/Git-2.14.2.3-32-bit.exe
	$ wine Git-2.14.2.3-32-bit.exe
	```

5. Install atlas on Wine

	```
	$ pip install git+https://github.com/Phelimb/atlas
	```

	> At present this fails with lots of errors, presumably resulting in the error folowing;

6. Build from inside 'dist' folder

	```
	$ # <cd dist>
	$ wine ~/.wine/drive_c/Python27/Scripts/pyinstaller.exe --noconfirm --workpath='./pyinstaller_build/binary_cache' --distpath='./pyinstaller_build' mykrobe_predictor_pyinstaller.spec
	```

	> At present this compiled binary fails with error
	> 'File "Mykrobe-predictor\mykrobe\mykrobe_predictor.py", line 17, in <module>
ImportError: No module named mykatlas.base'